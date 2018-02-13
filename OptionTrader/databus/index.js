var databus = require('./databus')
var { AppList, FileList } = require('./Command')
var ByteBuffer = require('bytebuffer')

// 根据proto获取command值
const commandCache = {}
function getCommandFromProto(proto_request, proto_response) {
	proto_response = proto_response || 'MsgExpress.CommonResponse'
	const proto_str = proto_request + '-' + proto_response 
	if (commandCache[proto_str]) {
		return commandCache[proto_str]
	}

	for (let i = 0, appCount = AppList.length; i < appCount; i++) {
		const app = AppList[i]
		const header = app['$']
		if (!header || !app['function']) {
			continue;
		}

		for (let j = 0, funcCount = app['function'].length; j < funcCount; j++) {
			const func = app['function'][j]
			const funcObj = func['$']
			if (funcObj) {
				if (funcObj.request === proto_request && funcObj.response === proto_response) {
					const val = (parseInt(header.id) << 20) | parseInt(funcObj.id)
					commandCache[proto_str] = val
					return val
				}
			}
		}
  }
  console.error('getCommandFromProto error, request:' + proto_response + ', response:' + proto_response)
	return null
}

// 根据command获取proto名字
function getProtoFromCommand(cmd) {
	const appId = cmd >> 20
	const funcId = (cmd - ((cmd >> 20) << 20))
	for (let i = 0, appCount = AppList.length; i < appCount; i++) {
		const app = AppList[i]
		const header = app['$']
		if (!header || !app['function']) {
			continue
		}

		if (parseInt(header.id) !== appId) {
			continue
		}

		for (let j = 0, funcCount = app['function'].length; j < funcCount; j++) {
			const func = app['function'][j]
			const funcObj = func['$']
			if (funcObj) {
				if (parseInt(funcObj.id) === funcId) {
					return {
						request: funcObj.request,
						response: funcObj.response
					}
				}
			}
		}
  }
  console.error('getProtoFromCommand error, cmd:' + cmd)
	return null
}

// 获取proto的文件名
function getProtoFilename(proto) {
	const prefix = proto.substring(0, proto.indexOf('.'))
	for (let file of FileList) {
		if (file.package === prefix) {
			return file.filename
		}
  }
  console.error('get proto filename error, proto:' + proto)
	return ''
}

// 解析推送的消息，老协议
// export function parsePublishMessage(protoFilename, jsonContent) {
// 	return new Promise((resolve, reject) => {
// 		if (jsonContent.length < 2) {
// 			return reject('json content error')
// 		}

// 		const name = jsonContent[0].value
// 		const content = jsonContent[1].value
// 		const arr = content.split(',')
// 		var bb = new Uint8Array(arr.length)
// 			for (let i = 0, count = arr.length; i < count; i++) {
// 				bb[i] = arr[i]
// 			}
		
// 			databus.buildProtoObject(protoFilename, name)
// 			.then((Msg) => {
// 				try {
// 					const decodedMsg = Msg.decode(bb)
// 					return resolve(decodedMsg)
// 				} catch (e) {
// 					return reject(e)
// 				}
// 			})
// 	})
// }

function dispatchPublishMessage(topic, content) {
  const proto = getProtoFromCommand(topic)
  if (!proto || !content || !content.length) {
    console.log('get proto from command failed, topic:' + topic + ',content:' + content)
    return
  }

  return databus.buildProtoObject(getProtoFilename(proto.request), proto.request)
  .then((Msg) => {
    try {
      const decodedMsg = Msg.decode(content)
      appClient.onPublishCallback(proto.request, decodedMsg)
    } catch (e) {
      console.log('dispatchPublishMessage', e)
    }
  }) 
}

class AppClient {
  constructor() {
    this._publishCallback = null
    this._subIdStart = 123
    this._heartBeatTimer = 0
    this._clientName = 'test'
    this._hearBeatIntervalSecond = 5 // 心跳间隔5秒
    this._isConnect = false
    this._addr = 0
  }

  setClientName(name) {
    this._clientName = name
  }

  setHeartBeatIntervalSecond(second) {
    this._hearBeatIntervalSecond = second
  }

  setProtoFileDir(dir) {
    databus.setProtoFileDir(dir)
  }

  initProtoJson() {
    databus.addProtoBuilder('msgexpress', require('./protobuf/msgexpress.json'))
    databus.addProtoBuilder('trade', require('./protobuf/trade.json'))
  }

	// 初始化连接
	open(wsip, wsport, wspath) {
    const self = this
		return new Promise((resolve, reject) => {
			databus.connect(wsip, wsport, wspath || '', {
          onConnectSuccess: function() {
            databus.setPushDataFactory(function(topic, content) {
              dispatchPublishMessage(topic, content)
            });
            self._isConnect = true
            self.startHeartBeat()
            self.loginBus().then((json) => {
              self.addr = json.addr
              console.log('login bus success', json)
              return resolve('success')
            }).catch((err) => {
              return reject(err)
            })
          },
          onConnectError: function(err) {
            return reject(err)
          },
          onConnectClose: function(err) {
            return reject(err)
          }
		  })
		})
	}

	close() {
		databus.close();
	}

	// 登录总线，连接成功后会默认登录
	loginBus() {
    const self = this
		return this.post('MsgExpress.LoginInfo', 'MsgExpress.LoginResponse', {
			type: 1, 
			name: self._clientName,
			group: 1, 
			uuid: 'rywyetyu24535', 
			starttime: 0, 
			auth: 'test'
		})
	}

  // 批量订阅
	subscribe(protoList, publishCallback) {
    const self = this
    this._publishCallback = publishCallback
    return databus.buildProtoObject("msgexpress", "MsgExpress.SubscribeData").then(obj => {
      let objList = []
      for (let i = 0, count = protoList.length; i < count; i++) {
        const cmd = getCommandFromProto(protoList[i])
        if (cmd) {
          obj.subid = self._subIdStart++
          obj.topic = cmd
          objList.push(obj)
        }
      }
      return Promise.resolve(objList)
    }).then((objList) => {
      return self.post("MsgExpress.ComplexSubscribeData", "MsgExpress.CommonResponse", {
        sub: objList
      }).then((res) => {
        if (res && res.retcode === 0) {
          console.log('subscribe success.')
          return Promise.resolve()
        } else {
          return Promise.reject(res)
        }
      })
    })
  }
  
  // 回调推送的消息
  onPublishCallback(name, msg) {
    if (this._publishCallback) {
      this._publishCallback(name, msg)
    }
  }

	// 发送消息，proto文件名通过Command.js中的FileList映射查找
	post(protoRequest, protoResponse, requestObj) {
    return this.postProto(getProtoFilename(protoRequest), protoRequest, protoResponse, requestObj)
  }

  // 发送消息，带proto文件名
  postProto(protoFilename, protoRequest, protoResponse, requestObj) {
    const self = this
		return new Promise((resolve, reject) => {
			const cmd = getCommandFromProto(protoRequest, protoResponse)
			if (!cmd) {
				console.error('command error, request:' + protoRequest + ', response:' + protoResponse)
				return reject()
      }
      console.log('111111 request cmd:' + cmd + ', file:' + protoFilename + ', request:' + protoRequest + ', response:' + protoRequest) 
			databus.requestOnce(cmd, protoFilename, protoRequest, protoResponse, {
				fillRequest: function(request) {
					Object.assign(request, requestObj)
				},
				handleResponse: function(response) {
					return resolve(response)
        },
        handlerError: function(err) {
          if (err === 'disconnect') {
            self._isConnect = false
          } else {
            console.error(err)
          }
          return resolve(err)
        }
			})
		})
  }

  // 开启心跳
	startHeartBeat() {
    this.closeHeartBeat()
    this._heartBeatTimer = setInterval(() => {
      if (!this._isConnect) {
        databus.reconnect()
        return
      }

      this.post("MsgExpress.HeartBeat", "MsgExpress.HeartBeatResponse", {
        cpu: 0, topmemory: 0, memory: 0, sendqueue: 0, receivequeue: 0
      }).then((msg) => {
      }).catch((err) => {
        console.log(err)
      })
    }, this._hearBeatIntervalSecond * 1000)
    console.log(this._heartBeatTimer)
  }
  
  // 关闭心跳
  closeHeartBeat() {
    if (this._heartBeatTimer) {
      clearInterval(this._heartBeatTimer)
    }
  }
}

const appClient = new AppClient()
export default appClient