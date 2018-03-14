(function(global, factory) {
/* CommonJS */ if (typeof require === 'function' && typeof module === "object" && module && module["exports"])
  module['exports'] = (function() {
    var cbusPackage = require('./cbusPackage');
    var ProtoBuf = require("protobufjs");
    var Long = require("long");
    ProtoBuf.util.Long = Long;
    ProtoBuf.configure();
    return factory(ProtoBuf, require('bytebuffer'), cbusPackage);
  })();
/* Global */ else
  global["cbusCore"] = factory(
    global.dcodeIO.ProtoBuf, 
    global.dcodeIO.ByteBuffer,
    global.cbusPackage,
  );
})(this, function(ProtoBuf, ByteBuffer, cbusPackage) {
  var ws = undefined;
  var serial = 65536;
  var protobufBuilders = {};

  var pushDataFactory = undefined;
  var mIp, mPort, mPath;
  var PREFIX_DATABUS = "DATABUS";
  var PROTO_FILE_DIR = '/protobuf/'

  var Observer = function() {
    this.subscribers = [];			// 订阅者数组
  }
  Observer.prototype = {
    sub : function(evt, fn) {		// 订阅方法，返回订阅event标识符
      this.subscribers[evt] ? this.subscribers[evt].push(fn) : (this.subscribers[evt] = []) && this.subscribers[evt].push(fn);
      return '{"evt":"' + evt + '","fn":"' + (this.subscribers[evt].length - 1) + '"}';
    },
    pub : function(evt, args) {	// 发布方法，成功后返回自身
      if (this.subscribers[evt]) {
        for (var i in this.subscribers[evt]) {
          if (typeof(this.subscribers[evt][i]) === 'function') {
            if (arguments.length === 2) {
              this.subscribers[evt][i](args);
            } else {
              this.subscribers[evt][i](arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6]);
            }
          }
        }
        return this;
      }
      return false;
    },
    unsub : function(subId) {		// 解除订阅，需传入订阅event标识符
      try {
        var id = JSON.parse(subId);
        this.subscribers[id.evt][id.fn] = null;
        delete this.subscribers[id.evt][id.fn];
      } catch (err) {
        console.log(err);
      }
    },
    contains : function(evt) {
      return this.subscribers[evt] ? true : false;
    }
  }
  var observer = new Observer();

  var cbusCore = {
    close: function () {
      if (ws) {
        console.log('close websocket');
        ws.onopen = function() {}
        ws.onmessage = function() {}
        ws.onclose = function() {}
        ws.close()
        ws = undefined
      }
    },
    readyState: function() {
      if (ws) {
        return ws.readyState
      }
      return -1
    },
    reconnect: function (options) {
      this.connect(mIp, mPort, mPath, options);
    },
    connect: function (ip, port, path, options) {
      mIp = ip;
      mPort = port;
      mPath = path;
      var settings = {
        onConnectSuccess: undefined,
        onConnectError: undefined,
        onConnectClose: undefined
      };
      this.extend(settings, options);
      var location = "ws://" + ip + ":" + port + path;
      console.log('websocket connect to:' + location);
      if (global.WebSocket) {
        ws = new global.WebSocket(location);
      } else if (global.MozWebSocket) {
        ws = new global.MozWebSocket(location);
      } else {
        console.log("No Support WebSocket...");
        return;
      }
      ws.binaryType = "arraybuffer";
      ws.onopen = function () {
        console.log("websocket connect success", ip, ":", port, path);
        if (settings.onConnectSuccess) {
          settings.onConnectSuccess();
        }
      };
      var ref = this;
      ws.onmessage = function (evt) {
        if (typeof (evt.data) === "string") {
          console.log("Receive String Data");
          return;
        }

        var bb, packages;
        try {
          bb = ByteBuffer.wrap(evt.data, "binary");
          packages = cbusPackage.decodePackage(bb);
        } catch(err) {
          console.log(err)
          return;
        }

        // 处理推送消息
        const handlePublish = (p) => {
          Promise.all([
              ref.buildProtoObject("msgexpress", "MsgExpress.DataType"),
              ref.buildProtoObject("msgexpress", "MsgExpress.PublishData")
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
                  if (type === DataType.STRING) { value = item.strVal[0]; } 
                  else if (type === DataType.INT64) { value = item.lVal[0]; } 
                  else if (type === DataType.UINT64) { value = item.ulVal[0]; }
                  else if (type === DataType.INT32) { value = item.iVal[0]; } 
                  else if (type === DataType.UINT32) { value = item.uiVal[0]; } 
                  else if (type === DataType.FLOAT) { value = item.fVal[0]; } 
                  else if (type === DataType.DOUBLE) { value = item.fVal[0]; } 
                  else if (type === DataType.DATETIME) { value = item.tVal[0]; } 
                  else if (type === DataType.BINARY) { value = item.rawVal[0].toString("binary"); }
                  content.push({ key: key, value: value });
                }
                if (pushDataFactory && content.length) {
                  pushDataFactory(msg.topic, content);
                }
              }
          }).catch(err => {
              console.error(err)
          })
        }

        for (var i = 0; i < packages.length; i++) {
          let p = packages[i];
          if (p.getType() === cbusPackage.Publish) {
            if (p.isPublishNewMsg()) {
              if (pushDataFactory) {
                pushDataFactory(p.getCommand(), p.body.view)
              }
            } else {
              handlePublish(p)
            }
          } else {
            ref.publishInfo(PREFIX_DATABUS, p.getSerialNumber(), p.body, p.getCommand() ? false : true);
          }
        }
      };
      ws.onclose = function (event) {
        console.log("websocket closed, code:" + event.code + ", reason:" + event.reason);
        if (settings.onConnectClose) {
          settings.onConnectClose(event);
        }
      };
      ws.onerror = function(event) {
        console.log('websocket error', event);
        if (settings.onConnectError) {
          settings.onConnectError(event);
        }
      }
    },

    // 可以使用json格式直接初始化
    addProtoBuilder: function(protoFileName, requireObj) {
      try {
        var root = ProtoBuf.Root.fromJSON(requireObj)
        protobufBuilders[protoFileName] = root
      } catch(err) {
        console.error('addProtoBuilder error', protoFileName, err)
      }
    },

    /**
     * 构建一个protobuf包
     */
    buildProtoPackage: function(proto_package) {
      return new Promise((resolve, reject) => {
        if (protobufBuilders[proto_package]) {
          return resolve(protobufBuilders[proto_package])
        }

        if (PROTO_FILE_DIR[PROTO_FILE_DIR.length - 1] !== '/') {
          PROTO_FILE_DIR += '/'
        }
        const protoFilePath = PROTO_FILE_DIR + proto_package + ".proto"
        ProtoBuf.load(protoFilePath).then((root) => {
          protobufBuilders[proto_package] = root;
          return resolve(root)
        }).catch((err) => {
          console.error('buildProtoPackage ', proto_package, err, protoFilePath)
          return reject(err)
        });
      })
    },
    /**
     * 构建一个protobuf对象
     */
    buildProtoObject: function(proto_package, proto_objectname) {
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
    },
    requestOnce: function(cmd, proto_package, proto_request, proto_response, callback) {
      return this.buildProtoObject(proto_package, proto_request).then((obj) => {
        var payload = {}
        callback.fillRequest(payload);
        // 验证填充的数据是否有效
        var errMsg = obj.verify(payload);
        if (errMsg) {
          console.error('requestOnce verify err', errMsg, proto_request, payload)
          throw Error(errMsg);
        }
        // 创建消息对象
        var message = obj.create(payload); // or use .fromObject if conversion is necessary
        console.log('requestOnce', message)
        // 编码二进制流
        var buffer = obj.encode(message).finish();
        // 一定要拷贝一份，否则byteOffset会一直累加（大概到250次）造成encodePackage错误
        buffer = new Uint8Array(buffer)
        // 包装成ByteBuffer
        var binary = ByteBuffer.wrap(buffer, "binary");
        this.sendmsg(cmd, binary, proto_package, proto_response, callback, false);
      })
    },
    sendmsg: function (cmd, byteBuffer, proto_package, proto_response, callback, forever) {
      var serialnum = serial++;
      var pack;
      try {
        pack = cbusPackage.encodePackage(serialnum, cmd, byteBuffer);
      } catch(err) {
        console.error(serialnum, cmd, err)
        return
      }
      
      if (forever === undefined || !forever) {
        const self = this
        this.subscribeInfo(PREFIX_DATABUS, serialnum, function(info, iserror) {
          if (iserror === undefined || !iserror) { // 处理应答
            self.buildProtoObject(proto_package, proto_response).then(obj => {
              try {
                const msg = obj.decode(info.view);
                callback.handleResponse(msg);
              } catch (e) {
                console.error(proto_response, e)
              }
            })
          } else if (callback.handlerError) {  // 处理错误
            self.buildProtoObject("msgexpress", "MsgExpress.ErrMessage").then(obj => {
              try {
                const msg = obj.decode(info.view);
                callback.handlerError(msg);
              } catch (e) {
                console.error('ErrMessage', e)
              }
            })
          }
        });
      }
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(pack.toArrayBuffer());
      }
    },
    setPushDataFactory: function (factory) {
      pushDataFactory = factory;
    },
    subscribeInfo: function (prefix, id, callback) {
      var subId = observer.sub(prefix + id, function (info, extra) {
        callback(info, extra);
        observer.unsub(subId);
      });
    },
    publishInfo: function (prefix, id, info, extra) {
      observer.pub(prefix + id, info, extra);
    },
    contains: function (id) {
      return observer.contains(id);
    },
    requestPublishData: function (topic, callbacks) {
      observer.sub(topic, function (args) {
        if (arguments.length === 1) {
          callbacks(args);
        } else {
          callbacks(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
        }
      });
    },
    notifyPublishData: function (topic, args) {
      if (arguments.length === 2) {
        observer.pub(topic, args);
      } else {
        observer.pub(topic, arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6]);
      }
    },
    extend: function (parent, child) {
      for (var p in child) {
        parent[p] = child[p];
      }
      return parent;
    },
    setProtoFileDir: function(dir) {
      PROTO_FILE_DIR = dir
    }
  }
  return cbusCore;
});
