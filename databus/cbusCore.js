(function (global, factory) {
  /* CommonJS */
  if (typeof require === 'function' && typeof module === "object" && module && module["exports"])
    module['exports'] = (function () {
      var ProtoBuf = require("protobufjs");
      var Long = require("long");
      ProtoBuf.util.Long = Long;
      ProtoBuf.configure();
      return factory(ProtoBuf, require('bytebuffer'), require('pako'));
    })();
  /* Global */
  else
    global["CBusCore"] = factory(global.protobuf, global.dcodeIO.ByteBuffer, global.pako);
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
              if (this.responseTimeout > 0 && (curTime - fnObj.time > this.responseTimeout * 1000)) {
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
      }, 1000);
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
   * 封包，拆包（包体除外，由protobufjs来处理）包头总共44字节
   */
  
  const cbusPackage = (function (ByteBuffer, pako) {
    var pack = function () {
      this.flag1 = pack.PACKAGE_START;        // 1 数据包开始标识
      this.flag2 = pack.PACKAGE_START;        // 1 数据包开始标识
      this.crc = 0;                           // 1 crc校验
      this.version = 1;                       // 1 版本号，1
      this.type = pack.REQUEST;               // 1 数据包类型MsgType
      this.offset = pack.SIZE_OF_HEAD;        // 1 数据块的偏移量
      this.options = 0;                       // 2 开关项
      // union {
      //   unsigned short options_;     //开关项
      //   struct {
      //     unsigned char hasext_ : 1; //是否有扩展数据
      //     unsigned char needreply_ : 1;//Publish消息时是否需要应答
      //     unsigned char protocol_ : 2;//数据序列化协议，0表示protobuf，1表示json
      //     unsigned char ismulticast_ : 1; //是否组播
      //     unsigned char issequence_ : 1; //是否时序消息
      //     unsigned char loadbalance_ : 2;
      //     unsigned char ispriority_ : 1;//是否优先处理
      //     unsigned char reserve_ : 7;
      //   };
      // };
      this.codeinfo = 0;                        // 2
      // union
      // {
      //   unsigned short codeinfo_;
      //   struct {
      //     unsigned short isencrypt_ : 1;//是否加密
      //     unsigned short iszip_ : 1;//是否压缩
      //     unsigned short encrypt_ : 4;//加密算法
      //     unsigned short compratio_ : 10;//压缩比
      //   };
      // };
      this.multipageinfo = 0;                  // 2 
      // union {
      //   unsigned short multipageinfo_;
      //   struct {
      //     unsigned short ismultipage_ : 1; //是否分包
      //     unsigned short pageno_ : 15;//包编号,从1开始编号，0表示最后一个包
      //   };
      // };
      this.serialNum = 0;                     // 4 流水号
      this.bodysize = 0;                      // 4 数据包体大小
      this.srcaddr = 0;                       // 4 源地址
      this.dstaddr = 0;                       // 4 目标地址
      this.command = 0;                       // 4 命令，全局唯一
      this.code = 0;                          // 2
      this.other = 0;                         // 2
      this.brokertrace = [0, 0, 0, 0, 0, 0, 0, 0]; // 8
      this.body = null;
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
      return this.offset;
    };
    pack.prototype.getBodySize = function () {
      return this.bodysize;
    };
    pack.prototype.setBodySize = function (bodysize) {
      this.bodysize = bodysize;
    };
    pack.prototype.getIsZip = function () {
      return (this.codeinfo & 0x2) === 2;
    };
    pack.prototype.getType = function () {
      return this.type;
    };

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
      buffer.writeByte(pk.crc);
      buffer.writeByte(pk.version);
      buffer.writeByte(pk.type);
      buffer.writeByte(pk.offset);
      buffer.writeUint16(pk.options);
      buffer.writeUint16(pk.codeinfo);
      buffer.writeUint16(pk.multipageinfo);
      buffer.writeInt(pk.serialNum);
      buffer.writeInt(pk.bodysize);
      buffer.writeInt(pk.srcaddr);
      buffer.writeInt(pk.dstaddr);
      buffer.writeInt(pk.command);
      buffer.writeUint16(pk.code);
      buffer.writeUint16(pk.other);
      for (let i = 0; i < pk.brokertrace.length; i++) {
        buffer.writeByte(pk.brokertrace[i]);
      }

      // 计算消息头CRC
      const CRC_POS = 3;
      for (let i = CRC_POS; i < pack.SIZE_OF_HEAD; i++) {
        pk.crc += buffer.view[i];
        pk.crc &= 0xFF;
      }
      // 重新写入CRC
      buffer.writeByte(pk.crc, CRC_POS - 1);
      
      if (pk.body) {
        pk.body.copyTo(buffer, buffer.offset, pk.body.offset, pk.body.limit)
      }

      buffer.offset = 0;
      return buffer;
    }

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
      p.crc = buffer.readByte();
      p.version = buffer.readByte();
      p.type = buffer.readByte();
      p.offset = buffer.readByte();
      p.options = buffer.readUint16();
      p.codeinfo = buffer.readUint16();
      p.multipageinfo = buffer.readUint16();
      p.serialNum = buffer.readInt();
      p.bodysize = buffer.readInt();
      p.srcaddr = buffer.readInt();
      p.dstaddr = buffer.readInt();
      p.command = buffer.readInt();
      p.code = buffer.readUint16();
      p.other = buffer.readUint16();
      for (let i = 0; i < p.brokertrace.length; i++) {
        p.brokertrace[i] = buffer.readByte();
      }
      return p;
    };

    pack.PACKAGE_START = 94;
    pack.REQUEST = 1;
    pack.RESPONSE = 2;
    pack.Publish = 3;
    pack.SIZE_OF_HEAD = 44;
    var recData = undefined;
    return pack;
  })(ByteBuffer, pako);

  /**
   * 通信核心类
   */
  class CBusCore {
    constructor(cmdParse) {
      this.cmdParse = cmdParse;
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
        this.ws.close()
        this.ws = undefined
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
      } else {
        console.log("No Support WebSocket..."); // fixme
        return;
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
          if (p.getType() === cbusPackage.Publish) {
            if (self.pushDataFactory) {
              self.pushDataFactory(p.getCommand(), p.body.view)
            }
          } else {
            self.publishInfo(PREFIX_DATABUS, p.getSerialNumber(), p.body, p.getCommand());
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
    requestOnce(cmd, proto_package, proto_request, callback) {
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
        return this.sendmsg(cmd, binary, proto_package, callback, false);
      })
    }

    // 序列化整个包，设置应答回调，发送消息
    sendmsg(cmd, byteBuffer, proto_package, callback, forever) {
      var serialnum = g_serial++;
      var pack;
      try {
        pack = cbusPackage.encodePackage(serialnum, cmd, byteBuffer);
      } catch (err) {
        console.error(serialnum, cmd, err)
        return Promise.reject(err);
      }

      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        if (forever === undefined || !forever) {
          const self = this
          this.subscribeInfo(PREFIX_DATABUS, serialnum, function (info, command) {
            const protoName = self.cmdParse.getProtoFileName(command);
            const className = self.cmdParse.getClassName(command);
            if (protoName.length && className.length) {
              if (protoName === 'msgexpress' && className === 'MsgExpress.ErrMessage') {
                self.buildProtoObject(protoName, className).then(obj => {
                  try {
                    const msg = obj.decode(info.view);
                    callback.handlerError(msg);
                  } catch (e) {
                    console.error('ErrMessage', e)
                  }
                })
              } else {
                self.buildProtoObject(protoName, className).then(obj => {
                  try {
                    const msg = obj.decode(info.view);
                    callback.handleResponse(msg);
                  } catch (e) {
                    console.error(proto_response, e)
                  }
                })
              }
            }
          });
        }
        this.ws.send(pack.toArrayBuffer());
      } else {
        return Promise.reject('websocket disconnect.')
      }
    }

    setPushDataFactory(factory) {
      this.pushDataFactory = factory;
    }

    subscribeInfo(prefix, id, callback) {
      var self = this;
      var subId = this.observer.sub(prefix + id, function (info, command) {
        callback(info, command);
        self.observer.unsub(subId);
      });
    }

    publishInfo(prefix, id, info, command) {
      this.observer.pub(prefix + id, info, command);
    }

    setProtoFileDir(dir) {
      this.PROTO_FILE_DIR = dir
    }
  }
  return CBusCore;
});