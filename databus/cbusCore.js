(function (global, factory) {
  // CommonJS, Global
  if (typeof require === 'function' && typeof module === "object" && module && module["exports"]) {
    module['exports'] = (function () {
      var ProtoBuf = require("protobufjs");
      var Long = require("long");
      ProtoBuf.util.Long = Long;
      ProtoBuf.configure();
      return factory(ProtoBuf, require('bytebuffer'), require('pako'));
    })();
  } else {
    global["CBusCore"] = factory(global.protobuf, global.dcodeIO.ByteBuffer, global.pako);
  }
})(this, function (ProtoBuf, ByteBuffer, pako) {
  var global = this;                        // 当前环境
  var g_serial = 65536;                     // 发送消息的起始序号
  var g_protobufBuilders = {};              // protobuf解析缓存
  var PREFIX_DATABUS = "DATABUS";           // 消息发送序号前缀

  /**
   * 暂存发送的消息，当消息发送时存储，收到消息后执行然后删除
   * 
   * @class Observer
   */
  class Observer {
    constructor() {
      this.responseTimeout = 10;            // 应答超时时间
      this.subscribers = {};                // 订阅者对象

      this.timeoutCheckerId = setInterval(() => {
        const curTime = new Date().getTime();
        for (const key in this.subscribers) {
          const fnCount = this.subscribers[key].length;
          let deleteCount = 0;
          // 检查请求的对象为空或者应答超时
          for (let i = 0; i < fnCount; i++) {
            const fnObj = this.subscribers[key][i]
            if (fnObj) {
              if (this.responseTimeout > 0 && (curTime - fnObj.time >= this.responseTimeout * 1000)) {
                fnObj.fn('timeout', true);
              }
            } else {
              deleteCount++;
            }
          }
          // 删除已经处理的请求
          if (fnCount === deleteCount) {
            delete this.subscribers[key];
          }
        }
      }, 2000);
    }
    setResponseTimeoutSecond(second) {
      this.responseTimeout = second;
    }

    /**
     * 存储消息
     * 
     * @param {string} evt 唯一标识一个消息（如果消息被拆包，一个标识符存储多个消息，以数组的形式）
     * @param {function} fn 应答后的回调
     * @returns string 根据返回值可以找到此消息
     * @memberof Observer
     */
    sub(evt, fn) {
      const obj = {
        fn: fn,
        time: new Date().getTime()
      };
      if (this.subscribers[evt]) {
        this.subscribers[evt].push(obj);
      } else {
        this.subscribers[evt] = [obj];
      }
      const fnNumber = this.subscribers[evt].length - 1;
      return '{"evt":"' + evt + '","fn":"' + fnNumber + '"}';
    }

    /**
     * 响应应答，执行回调
     * 
     * @param {string} evt 消息标识符
     * @param {any} args 多参数
     * @returns null
     * @memberof Observer
     */
    pub(evt, args) {
      if (!this.subscribers[evt]) {
        console.error('put not find, sn:' + evt);
        return;
      }

      for (let i = 0, count = this.subscribers[evt].length; i < count; i++) {
        const fnObj = this.subscribers[evt][i];
        if (fnObj && (typeof fnObj.fn === 'function')) {
          if (arguments.length === 2) {
            fnObj.fn(args);
          } else {
            fnObj.fn(arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6])
          }
        }
      }
    }

    /**
     * 移除消息
     * 
     * @param {string} subId json字符串，sub方法返回的
     * @memberof Observer
     */
    unsub(subId) {
      try {
        var id = JSON.parse(subId);
        if (this.subscribers[id.evt] && this.subscribers[id.evt][id.fn]) {
          // console.log('unsub sn:' + id.evt + '.' + id.fn + ', cost:' + (new Date().getTime() - this.subscribers[id.evt][id.fn].time) + 'ms');
          delete this.subscribers[id.evt][id.fn];
        }
      } catch (err) {
        console.log('unsub', err);
      }
    }
  }

  /**
   * 封包，拆包（包体除外，由protobufjs来处理）
   */
  const cbusPackage = (function (ByteBuffer, pako) {
    var pack = function () {
      this.flag1 = pack.PACKAGE_START;
      this.flag2 = pack.PACKAGE_START;
      this.version = 1;
      this.type = pack.REQUEST;
      this.off = pack.SIZE_OF_HEAD;
      this.options = 0;
      this.codeinfo = 0;
      this.reserve1 = 0;
      this.serialNum = 0;
      this.bodysize = 0;
      this.srcaddr = 0;
      this.dstaddr = 0;
      this.command = 0;
      this.body = null;
      this.shortCode = 0;
    };
    pack.prototype.setSerialNumber = function (serialNum) {
      this.serialNum = serialNum;
    };
    pack.prototype.getSerialNumber = function () {
      return this.serialNum;
    };
    pack.prototype.setBody = function (body) {
      this.body = body;
    };
    pack.prototype.getBody = function () {
      return this.body;
    };
    pack.prototype.setCommand = function (command) {
      this.command = command;
    };
    pack.prototype.getCommand = function () {
      return this.command;
    };
    pack.prototype.getOffset = function () {
      return this.off;
    };
    pack.prototype.getBodySize = function () {
      return this.bodysize;
    };
    pack.prototype.setBodySize = function (bodysize) {
      this.bodysize = bodysize;
    };
    pack.prototype.getIsZip = function () {
      return (this.codeinfo & 0x1) === 1;
    };
    pack.prototype.getType = function () {
      return this.type;
    };

    pack.prototype.isPublishNewMsg = function () {
      if (this.options && (((this.options >> 7) & 1) === 1)) {
        return true
      }
      return false
    }

    /**
     * 封包，头部30字节+包体
     * @param {number} serialNum 流水号
     * @param {number} command 指令，对应的某个请求
     * @param {*} body 二进制包体
     */
    pack.encodePackage = function (serialNum, command, body) {
      var pk = new pack();
      pk.setSerialNumber(serialNum);
      pk.setCommand(command);
      pk.setBody(body);
      pk.setBodySize(body.limit);

      var buffer = new ByteBuffer(pack.SIZE_OF_HEAD + pk.getBodySize());
      buffer.writeByte(pk.flag1);
      buffer.writeByte(pk.flag2);
      buffer.writeByte(pk.version);
      buffer.writeByte(pk.type);
      buffer.writeByte(pk.off);
      buffer.writeByte(pk.options);
      buffer.writeByte(pk.codeinfo);
      buffer.writeByte(pk.reserve1);
      buffer.writeInt(pk.serialNum);
      buffer.writeInt(pk.bodysize);
      buffer.writeInt(pk.srcaddr);
      buffer.writeInt(pk.dstaddr);
      buffer.writeInt(pk.command);
      buffer.writeInt16(pk.shortCode);
      if (pk.body) {
        pk.body.copyTo(buffer, buffer.offset, pk.body.offset, pk.body.limit)
      }
      buffer.offset = 0;
      return buffer;
    }

    pack.decodePackage1 = function (buffer) {
      var packages = [];
      while (buffer.remaining() > 0) {
        // read util 'P'
        if (!(buffer.readByte() === pack.PACKAGE_START && buffer.readByte() === pack.PACKAGE_START)) {
          continue;
        }
        var start = buffer.offset - 2;
        var headerBytes = buffer.copy(start, start + pack.SIZE_OF_HEAD);
        buffer.skip(pack.SIZE_OF_HEAD - 2);
        var header = pack.decodeHeader(headerBytes);
        packages.push(header);

        if (header.getOffset() - pack.SIZE_OF_HEAD > 0) {
          buffer.skip(header.getOffset() - pack.SIZE_OF_HEAD);
        }
        var bodySize = header.getBodySize();
        var bodyStart = buffer.offset;
        var bodyBytes = buffer.copy(bodyStart, bodyStart + bodySize);
        buffer.skip(bodySize);
        if (!header.getIsZip()) {
          header.body = bodyBytes;
        } else {
          header.body = ByteBuffer.wrap(pako.inflate(new Uint8Array(bodyBytes.toArrayBuffer())));
        }
      }
      return packages;
    };

    /**
     * 拆包，先拆头部30个字节，获取包体大小，然后再获取包体的二进制流（后面会用protobuf来解析）
     * @param {array} packages 传出值，存储解析后的包
     * @param {ByteBuffer} buffer 二进制消息
     */
    pack.decodePackageInternal = function (packages, buffer) {
      var i = 0;
      while (buffer.remaining() > 0) {
        if (buffer.remaining < pack.SIZE_OF_HEAD) {
          break;
        }
        // 每个包的头两个字节都是80，即'P'
        if (!(buffer.readByte() === pack.PACKAGE_START && buffer.readByte() === pack.PACKAGE_START)) {
          continue;
        }
        var start = buffer.offset - 2;
        var headerBytes = buffer.copy(start, start + pack.SIZE_OF_HEAD);
        buffer.skip(pack.SIZE_OF_HEAD - 2);
        var header = pack.decodeHeader(headerBytes);
        var offset = header.getOffset() - pack.SIZE_OF_HEAD;
        if (offset > 0) {
          buffer.skip(offset);
        }
        var bodySize = header.getBodySize();
        var bodyStart = buffer.offset;
        var bodyBytes = buffer.copy(bodyStart, bodyStart + bodySize);
        if (buffer.remaining < bodySize) {
          break;
        }
        buffer.skip(bodySize);
        if (!header.getIsZip()) {
          header.body = bodyBytes;
        } else {
          header.body = ByteBuffer.wrap(pako.inflate(new Uint8Array(bodyBytes.toArrayBuffer())));
        }
        i += (pack.SIZE_OF_HEAD + offset + bodySize);
        packages.push(header);
      }
      return i;
    }

    /**
     * 拆包，如果有老的数据没有处理完成，加入到这次中进行处理
     * @param {ByteBuffer} buffer 
     */
    pack.decodePackage = function (buffer) {
      var packages = [];
      if (buffer === undefined || buffer.remaining() === 0) {
        return packages;
      }
      if (recData !== undefined && recData.remaining() > 0) {
        console.log('old data, size:', recData.remaining())
        var buffers = [buffer, recData];
        var newBuffer = ByteBuffer.concat(buffers);
        recData = newBuffer;
      } else {
        recData = buffer;
      }
      recData.mark();
      var i = this.decodePackageInternal(packages, recData);
      recData.reset();
      if (i > 0) {
        recData.skip(i);
      }
      return packages;
    };

    /**
     * 解析包头 30字节
     * @param {ByteBuffer} buffer 
     */
    pack.decodeHeader = function (buffer) {
      var p = new pack();
      p.flag1 = buffer.readByte();
      p.flag2 = buffer.readByte();
      p.version = buffer.readByte();
      p.type = buffer.readByte();
      p.off = buffer.readByte();
      p.options = buffer.readByte();
      p.codeinfo = buffer.readByte();
      p.reserve1 = buffer.readByte();
      p.serialNum = buffer.readInt();
      p.bodysize = buffer.readInt();
      p.srcaddr = buffer.readInt();
      p.dstaddr = buffer.readInt();
      p.command = buffer.readInt();
      p.shortCode = buffer.readInt16();
      return p;
    };

    pack.PACKAGE_START = 80;
    pack.REQUEST = 1;
    pack.RESPONSE = 2;
    pack.Publish = 3;
    pack.SIZE_OF_HEAD = 0x1e;
    var recData = undefined;
    return pack;
  })(ByteBuffer, pako);

  /**
   * 通信核心类
   */
  class CBusCore {
    constructor() {
      this.ws = undefined; // WebSocket
      this.enableReconnect = false; // 是否可以进行重连
      this.pushDataFactory = undefined; // 处理推送的消息
      this.PROTO_FILE_DIR = '/protobuf/'; // proto文件所在目录
      this.settings = {
        onConnectSuccess: undefined,
        onConnectError: undefined,
        onConnectClose: undefined
      };
      this.observer = new Observer();
    }

    close() {
      if (this.ws) {
        this.ws.onopen = function () {}
        this.ws.onmessage = function () {}
        this.ws.onclose = function () {}
        this.ws.onerror = function() {}
        this.ws.close()
        this.ws = undefined;
      }
    }

    readyState() {
      if (this.ws) {
        return this.ws.readyState
      }
      return -1
    }

    setResponseTimeoutSecond(second) {
      this.observer.setResponseTimeoutSecond(second);
    }

    setConnectOptions(opts) {
      for (var p in opts) {
        if (this.settings[p]) {
          delete this.settings[p];
        }
        this.settings[p] = opts[p];
      }
    }

    connect(wsurl, opts) {
      var self = this;
      this.setConnectOptions(opts);
      console.log('websocket connect to:' + wsurl);
      if (global.WebSocket) {
        this.ws = new global.WebSocket(wsurl);
      } else if (global.MozWebSocket) {
        this.ws = new global.MozWebSocket(wsurl);
      } else if (typeof require === 'function') {
        global.WebSocket = require('websocket').w3cwebsocket;
        this.ws = new global.WebSocket(wsurl);
      } else {
        console.log("No Support WebSocket..."); // fixme
        return;
      }

      /**
       * 解析老的方式推送的包
       * @param {package} p 
       */
      const handleOldPublish = function (p) {
        Promise.all([
          self.buildProtoObject("msgexpress", "MsgExpress.DataType"),
          self.buildProtoObject("msgexpress", "MsgExpress.PublishData")
        ]).then(values => {
          const DataType = values[0].values
          const publishObj = values[1]
          const msg = publishObj.decode(p.body.view)
          if (msg && msg.item) {
            let content = []
            for (let j = 0; j < msg.item.length; j++) {
              let item = msg.item[j];
              let key = item.key;
              let type = item.type;
              let value = item.value[0];
              if (type === DataType.STRING) {
                value = item.strVal[0];
              } else if (type === DataType.INT64) {
                value = item.lVal[0];
              } else if (type === DataType.UINT64) {
                value = item.ulVal[0];
              } else if (type === DataType.INT32) {
                value = item.iVal[0];
              } else if (type === DataType.UINT32) {
                value = item.uiVal[0];
              } else if (type === DataType.FLOAT) {
                value = item.fVal[0];
              } else if (type === DataType.DOUBLE) {
                value = item.fVal[0];
              } else if (type === DataType.DATETIME) {
                value = item.tVal[0];
              } else if (type === DataType.BINARY) {
                value = item.rawVal[0].toString("binary");
              }
              content.push({
                key: key,
                value: value
              });
            }
            if (self.pushDataFactory && content.length) {
              self.pushDataFactory(msg.topic, content);
            }
          }
        }).catch(err => {
          console.error(err);
        })
      }

      /**
       * 指定二进制数据类型
       */
      this.ws.binaryType = "arraybuffer";

      /**
       * 连接打开
       */
      this.ws.onopen = function () {
        console.log("websocket connect success");
        if (self.settings.onConnectSuccess) {
          self.settings.onConnectSuccess();
        }
      };

      /**
       * 收到消息
       * @param {event} evt 
       */
      this.ws.onmessage = function (evt) {
        if (typeof (evt.data) === "string") {
          console.log("receive string data");
          return;
        }

        let packages = undefined;
        try {
          const bb = ByteBuffer.wrap(evt.data, "binary");
          packages = cbusPackage.decodePackage(bb);
        } catch (err) {
          console.log('decode package', err)
          return;
        }

        for (let i = 0, count = packages.length; i < count; i++) {
          const p = packages[i];
          // for nodejs
          if (!p.body.view && p.body.buffer) {
            p.body.view = p.body.buffer
          }
          
          if (p.getType() === cbusPackage.Publish) {
            if (p.isPublishNewMsg()) {
              if (self.pushDataFactory) {
                self.pushDataFactory(p.getCommand(), p.body.view)
              }
            } else {
              handleOldPublish(p)
            }
          } else {
            self.publishInfo(PREFIX_DATABUS, p.getSerialNumber(), p.body, p.getCommand() ? false : true);
          }
        }
      };

      /**
       * 连接被关闭，等待重连
       * @param {event} event 
       */
      this.ws.onclose = function (event) {
        console.log("websocket closed, code:" + event.code);
        if (self.settings.onConnectClose) {
          self.settings.onConnectClose(event);
        }
      };

      /**
       * 连接出错
       * @param {event} event 
       */
      this.ws.onerror = function (event) {
        console.log('websocket error', event);
        if (self.settings.onConnectError) {
          self.settings.onConnectError(event);
        }
      }
    }

    // 可以使用json格式直接初始化
    addProtoBuilder(protoFileName, requireObj) {
      try {
        var root = ProtoBuf.Root.fromJSON(requireObj)
        g_protobufBuilders[protoFileName] = root
      } catch (err) {
        console.error('addProtoBuilder error', protoFileName, err)
      }
    }

    // 构建一个protobuf包，并缓存
    buildProtoPackage(proto_package) {
      return new Promise((resolve, reject) => {
        if (g_protobufBuilders[proto_package]) {
          return resolve(g_protobufBuilders[proto_package])
        }

        if (this.PROTO_FILE_DIR[this.PROTO_FILE_DIR.length - 1] !== '/') {
          this.PROTO_FILE_DIR += '/'
        }
        const protoFilePath = this.PROTO_FILE_DIR + proto_package + ".proto"
        ProtoBuf.load(protoFilePath).then((root) => {
          g_protobufBuilders[proto_package] = root;
          return resolve(root)
        }).catch((err) => {
          console.error('buildProtoPackage ', proto_package, err, protoFilePath)
          return reject(err)
        });
      })
    }

    // 构建一个protobuf对象
    buildProtoObject(proto_package, proto_objectname) {
      return new Promise((resolve, reject) => {
        const packageName = proto_package
        const objectName = proto_objectname
        return this.buildProtoPackage(packageName).then((root) => {
          const obj = root.lookupTypeOrEnum(objectName)
          if (obj) {
            // console.log('buildProtoObject', proto_package, proto_objectname)
            return resolve(obj)
          }
          const errStr = 'builerProtoObject ' + objectName + ' failed'
          console.error(errStr)
          return reject(errStr)
        })
      })
    }

    // 序列化包体
    requestOnce(cmd, proto_package, proto_request, proto_response, callback) {
      return this.buildProtoObject(proto_package, proto_request).then((obj) => {
        var payload = {}
        callback.fillRequest(payload);
        // 验证填充的数据是否有效
        var errMsg = obj.verify(payload);
        if (errMsg) {
          console.error('requestOnce verify err', errMsg, proto_request, payload)
          return Promise.reject('requestOnce verify err: ' + errMsg + ',' + proto_request)
        }
        // 创建消息对象
        var message = obj.create(payload); // or use .fromObject if conversion is necessary
        // console.log('requestOnce', message)
        // 编码二进制流
        var buffer = obj.encode(message).finish();
        // 一定要拷贝一份，否则byteOffset会一直累加（大概到250次）造成encodePackage错误
        buffer = new Uint8Array(buffer)
        // 包装成ByteBuffer
        var binary = ByteBuffer.wrap(buffer, "binary");
        if (!this.sendmsg(cmd, binary, proto_package, proto_response, callback)) {
          return Promise.reject('send msg failed');
        }
        return Promise.resolve();
      })
    }

    // 序列化整个包，设置应答回调，发送消息
    sendmsg(cmd, byteBuffer, proto_package, proto_response, callback) {
      var serialnum = g_serial++;
      var pack;
      try {
        pack = cbusPackage.encodePackage(serialnum, cmd, byteBuffer);
      } catch (err) {
        console.error(serialnum, cmd, err)
        return false;
      }

      if (!(this.ws && this.ws.readyState === 1)) {
        console.error('ready state is not open')
        return false;
      }

      const self = this
      this.subscribeInfo(PREFIX_DATABUS, serialnum, function (info, iserror) {
        if (iserror === undefined || !iserror) { // 处理应答
          self.buildProtoObject(proto_package, proto_response).then(obj => {
            try {
              const msg = obj.decode(info.view);
              callback.handleResponse(msg);
            } catch (e) {
              console.error(proto_response, e)
            }
          })
        } else if (callback.handlerError) { // 处理错误
          if (info instanceof ByteBuffer) {
            self.buildProtoObject("msgexpress", "MsgExpress.ErrMessage").then(obj => {
              try {
                const msg = obj.decode(info.view);
                callback.handlerError(msg);
              } catch (e) {
                console.error('ErrMessage', e)
              }
            })
          } else {
            callback.handlerError(info);
          }
        }
      });
      this.ws.send(pack.toArrayBuffer());
      return true;
    }

    setPushDataFactory(factory) {
      this.pushDataFactory = factory;
    }

    subscribeInfo(prefix, id, callback) {
      var self = this;
      var subId = this.observer.sub(prefix + id, function (info, extra) {
        callback(info, extra);
        self.observer.unsub(subId);
      });
    }

    publishInfo(prefix, id, info, extra) {
      this.observer.pub(prefix + id, info, extra);
    }

    setProtoFileDir(dir) {
      this.PROTO_FILE_DIR = dir
    }
  }
  return CBusCore;
});