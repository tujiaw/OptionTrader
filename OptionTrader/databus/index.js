
import { wsip, wsport, path } from '../config'
import * as Cons from './command'
import { timestampformat } from '../utils/tools'
var databus = require('./databus')

export const heartBeat = (function() {
	let timerid
	return {
		start: function() {
			this.stop()
			timerid = setInterval(sendHeartBeat, 5000)
		},
		stop: function() {
			clearInterval(timerid)
		}
	}
}())

/**
 * 发送心跳包
 */
function sendHeartBeat() {
  	databus.requestOnce(Cons.COMMAND_DATABUS_HEART_BEAT, "msgexpress", "MsgExpress.HeartBeat", "MsgExpress.HeartBeatResponse", {
			fillRequest : function(request) {
				console.log(" - Send HeartBeat Request To Gateway");
				request.cpu = 0;
				request.topmemory = 0;
				request.memory = 0;
				request.sendqueue = 0;
				request.receivequeue = 0;
			},
			handleResponse : function(response) {
        console.log(response);
				console.log(" - Receive HeartBeatResponse From Gateway, retCode:" + response.retcode);
			}
		});
}

/**
 *  批量订阅
 * @param {[number]} subList 
 * @param {[number]} topicList 
 */
function subscribeList(subList, topicList) {
	if (subList == null || subList.length === 0 || subList.length !== topicList.length) {
    console.error('subscribeList params error')
    return Promise.reject('subscribeList params error')
  }
  
  return databus.buildProtoObject("msgexpress", "MsgExpress.SubscribeData").then(obj => {
    let objList = []
    for (let i = 0; i < subList.length; i++) {
      let newObj = {...obj}
      newObj.subid = subList[i]
      newObj.topic = topicList[i]
      objList.push(newObj)
    }
    return Promise.resolve(objList)
  }).then((objList) => {
    databus.requestOnce(Cons.COMMAND_DATABUS_SUBSCRIBE, "msgexpress", "MsgExpress.ComplexSubscribeData", "MsgExpress.CommonResponse", {
      fillRequest: function (request) {
        console.log(" - Send ComplexSubscribeData Request");
        request.sub = objList;
      },
      handleResponse: function (response) {
        console.log(" - Receive ComplexSubscribeData, retCode:" + response.retcode);
        if (response && response.retcode === 0) {
          return Promise.resolve()
        } else {
          return Promise.reject(response)
        }
			}
		});
  })
}

/**
 * websocket连接
 */
export function startWebSocket() {
  return new Promise((resolve, reject) => {
      databus.connect(wsip, wsport, path, {
				onConnectSuccess: function() {
					databus.setPushDataFactory(function(topic, jsonContent) {
						parsePublishData(topic, jsonContent);
					});
					heartBeat.start()
					return resolve();
				},
				onConnectError: function() {
					return reject()
				},
				onConnectClose: function() {
					return reject()
				}
    })
  })
}

/**
 * 关闭websocket连接
 */
export function closeWebSocket() {
  databus.close();
}

function parsePublishData(topic, jsonContent) {
  if (topic === Cons.TOPIC_LOG || 
    topic === Cons.TOPIC_LOGIN || 
    topic === Cons.TOPIC_LOGOUT ||
    topic === Cons.TOPIC_GATEWAY || 
		topic === Cons.TOPIC_MSG ||
		topic === Cons.TOPIC_HEARTBEAT) {
      databus.notifyPublishData(topic, jsonContent);
	}
}

/**
 * 登录
 * @param {string} username 
 * @param {string} password 
 */
export function login(username, password) {
  return new Promise((resolve, reject) => {
    databus.requestOnce(Cons.COMMAND_DATABUS_LOGININFO, "msgexpress", "MsgExpress.LoginInfo", "MsgExpress.LoginResponse", { 
      fillRequest: function (request) {
        console.log(" - Send LoginInfo Request To Server");
        request.type = 1;
        request.name = "MONITOR";
        request.group = 1;//type=0时忽略
        request.uuid = "rywyetyu24535"; //唯一标识，type=0时忽略
        request.starttime = 0;
        request.auth = "test"; //认证码，type=0时忽略
      },
      handleResponse: function (response) {
				console.log(" - Receive LoginResponse Response From Server:" + JSON.stringify(response));
        return resolve(response);
      }});
  })
}
