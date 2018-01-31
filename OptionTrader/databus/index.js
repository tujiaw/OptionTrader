
import { wsip, wsport, path } from '../config'
import * as Cons from './command'
import { timestampformat } from '../utils/tools'
import { onlineRealtimeData } from './data/onlineRealtimeData'
import { appinfo } from './data/appinfo'
import topoinfo from './data/topoinfo'
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
				onlineSubscribe();
        return resolve(response);
      }});
  })
}

/**
 * 获取指定App信息
 * @param {*number} addr 
 */
function getAppInfo(addr) {
	return new Promise((resolve, reject) => {
		databus.requestOnce(Cons.COMMAND_GET_APP_INFO, "msgexpress", "MsgExpress.GetAppInfo", "MsgExpress.AppInfo", {
			fillRequest: function (request) {
				console.log("get app info, addr:" + addr);
				request.addr = addr
			},
			handleResponse: function (response) {
				return resolve(response)
			},
			handlerError: function (error) {
				console.log("Error Message, Code:" + error.code + ", Message:" + error.msg);
				reject(error)
			}
		});
	})
}

/**
 * 服务在线订阅
 */
export function onlineSubscribe() {
  databus.requestPublishData(Cons.TOPIC_LOGIN, dispatchPublishLoginMessage)
  databus.requestPublishData(Cons.TOPIC_LOGOUT, dispatchPublishLogoutMessage)
	databus.requestPublishData(Cons.TOPIC_HEARTBEAT, dispatchPublishHeartBeatMessage)
	databus.requestPublishData(Cons.TOPIC_LOG, dispatchPublishLogMessage);
	databus.requestPublishData(Cons.TOPIC_GATEWAY, dispatchPublishGatewayMessage);

  subscribeList([
			Cons.SUBID_TO_LOGIN, 
			Cons.SUBID_TO_LOGOUT, 
			Cons.SUBID_TO_HEARTBEAT,
			Cons.SUBID_TO_LOG,
			Cons.SUBID_TO_GATEWAY,
			Cons.SUBID_TO_MSG
		], [
			Cons.TOPIC_LOGIN, 
			Cons.TOPIC_LOGOUT, 
			Cons.TOPIC_HEARTBEAT,
			Cons.TOPIC_LOG,
			Cons.TOPIC_GATEWAY,
			Cons.TOPIC_MSG
		])
}

function dispatchPublishLoginMessage(jsonContent) {
	console.log('dispatchPublishLoginMessage')
  const msgExpress = Cons.msgExpress
	if(jsonContent) {
		let uuid, address, name, ip, startTime, loginTime, serviceid, type;
		for (let i = 0; i < jsonContent.length; i++) {
			if (jsonContent[i].key === msgExpress.KEY_UUID) {
				uuid = jsonContent[i].value;
			} else if (jsonContent[i].key === msgExpress.KEY_ADDR) {
				address = jsonContent[i].value;
			} else if (jsonContent[i].key === msgExpress.KEY_NAME) {
				name = jsonContent[i].value;
			} else if (jsonContent[i].key === msgExpress.KEY_IP) {
				ip = jsonContent[i].value;
			} else if (jsonContent[i].key === msgExpress.KEY_STARTTIME) {
				startTime = timestampformat(jsonContent[i].value);
			} else if (jsonContent[i].key === msgExpress.KEY_LOGINTIME) {
				loginTime = timestampformat(jsonContent[i].value);
			} else if (jsonContent[i].key === msgExpress.KEY_SERVICE) {
				serviceid = jsonContent[i].value;
			} else if (jsonContent[i].key === msgExpress.KEY_TYPE) {
				type = jsonContent[i].value;
			}
		}

		onlineRealtimeData.update(address, 'uuid', uuid)
		onlineRealtimeData.update(address, 'signin_time', loginTime)
		onlineRealtimeData.update(address, 'start_time', startTime)
		onlineRealtimeData.update(address, 'ip', ip)
		onlineRealtimeData.update(address, 'name', name)
		onlineRealtimeData.update(address, 'id', serviceid)
		onlineRealtimeData.update(address, 'type', type)

		for (let i = 0; i < topoinfo.logoutAddr.length; i++) {
			if (uuid.length && topoinfo.logoutAddr[i].uuid === uuid) {
				topoinfo.logoutAddr.splice(i, 1);
			}
		}
	}
}

function dispatchPublishLogoutMessage(jsonContent) {
	console.log('dispatchPublishLogoutMessage')
	if(jsonContent) {
		var uuid;
		for (var i = 0; i < jsonContent.length; i++) {
			if (jsonContent[i].key === Cons.msgExpress.KEY_UUID) {
				uuid = jsonContent[i].value;
			}
		}

		const logoutTotoArr = onlineRealtimeData.getTopoinfoFromUUID(uuid)
		if (logoutTotoArr.length) {
			topoinfo.logoutAddr = topoinfo.logoutAddr.concat(logoutTotoArr)
		}

		onlineRealtimeData.removeFromUUID(uuid)
	}
}

function dispatchPublishHeartBeatMessage(jsonContent) {
	console.log('dispatchPublishHeartBeatMessage')
  const msgExpress = Cons.msgExpress
	if(jsonContent) {
		var reqRecv = 0, reqSend = 0, resRecv = 0, resSend = 0, pubRecv = 0, pubSend = 0,queueSend = 0, queueRecv = 0;
		var beatTime='',uuid='',addr = '',broker='';
		for (var i = 0; i < jsonContent.length; i++) {
			if (jsonContent[i].key === msgExpress.KEY_HBTIME) {
				beatTime = timestampformat(jsonContent[i].value);
			} else if (jsonContent[i].key === msgExpress.KEY_UUID) {
				uuid = jsonContent[i].value;
			} else if (jsonContent[i].key === msgExpress.KEY_CSQUEUE) {
				queueSend = parseInt(jsonContent[i].value, 10);
			} else if (jsonContent[i].key === msgExpress.KEY_CRQUEUE) {
				queueRecv = parseInt(jsonContent[i].value, 10);
			} else if (jsonContent[i].key === msgExpress.KEY_RECVREQUEST) {
				reqRecv = parseInt(jsonContent[i].value, 10);
			} else if (jsonContent[i].key === msgExpress.KEY_SENTREQUEST) {
				reqSend = parseInt(jsonContent[i].value, 10);
			} else if (jsonContent[i].key === msgExpress.KEY_RECVRESPONSE) {
				resRecv = parseInt(jsonContent[i].value, 10);
			} else if (jsonContent[i].key === msgExpress.KEY_SENTRESPONSE) {
				resSend = parseInt(jsonContent[i].value, 10);
			} else if (jsonContent[i].key === msgExpress.KEY_RECVPUBLISH) {
				pubRecv = parseInt(jsonContent[i].value, 10);
			} else if (jsonContent[i].key === msgExpress.KEY_SENTPUBLISH) {
				pubSend = parseInt(jsonContent[i].value, 10);
			} else if(jsonContent[i].key === msgExpress.KEY_ADDR){
				addr = jsonContent[i].value;
			}
			else if(jsonContent[i].key === msgExpress.KEY_BROKER){
				broker = jsonContent[i].value.toString()
			}
		}
		const addrstr = onlineRealtimeData.addrstr(addr)
		if (addrstr.length) {
			onlineRealtimeData.update(addrstr, 'key', addrstr)
			onlineRealtimeData.update(addrstr, 'uuid', uuid)
			onlineRealtimeData.update(addrstr, 'broker', broker)
			onlineRealtimeData.update(addrstr, 'address', addrstr)
			onlineRealtimeData.update(addrstr, 'heartbeat', beatTime)
			if (reqSend > 0 || resRecv > 0) { 
				onlineRealtimeData.update(addrstr, 'sendreq_recvres', `${reqSend}/${resRecv}`) 
			}
			if (reqRecv > 0 || resSend > 0) {
				onlineRealtimeData.update(addrstr, 'recvreq_sendres', `${reqRecv}/${resSend}`)
			}
			if (pubSend > 0 || pubRecv > 0) { 
				onlineRealtimeData.update(addrstr, 'sendpub_recvpub', `${pubSend}/${pubRecv}` )
			}
			if (queueSend > 0 || queueSend > 0) { 
				onlineRealtimeData.update(addrstr, 'sendqueue_recvqueue', `${queueSend}/${queueRecv}` )
			}

			if (!appinfo.isExist(addrstr)) {
					getAppInfo(addr).then(res => {
						appinfo.set(addrstr, res)
						if (res.addr) {
							const logininfo = res.loginInfo
							onlineRealtimeData.update(addrstr, 'signin_time', timestampformat(res.logintime))
							onlineRealtimeData.update(addrstr, 'start_time', timestampformat(logininfo.starttime))
							onlineRealtimeData.update(addrstr, 'ip', logininfo.ip)
							onlineRealtimeData.update(addrstr, 'name', logininfo.name)
							onlineRealtimeData.update(addrstr, 'id', logininfo.serviceid.join(','))

							if (logininfo.uuid && logininfo.uuid.length) {
								topoinfo.appInfoMap[logininfo.uuid] = logininfo
							}
						}
					})
			}
		}
		onlineRealtimeData.dispatch()

		// topo图数据
		if (uuid.length) {
			topoinfo.heartbeatbyuuid[uuid] = {};
			topoinfo.heartbeatbyuuid[uuid].reqsend = reqSend;
			topoinfo.heartbeatbyuuid[uuid].resrecv = resRecv;
			topoinfo.heartbeatbyuuid[uuid].ressend = resSend;
			topoinfo.heartbeatbyuuid[uuid].reqrecv = reqRecv;
			topoinfo.heartbeatbyuuid[uuid].pubsend = pubSend;
			topoinfo.heartbeatbyuuid[uuid].pubrecv = pubRecv;
			topoinfo.heartbeatbyuuid[uuid].queuesend = queueSend;
			topoinfo.heartbeatbyuuid[uuid].queuerecv = queueRecv;
		}
		if (broker.length && topoinfo.brokerArr.indexOf(broker) === -1) {
			topoinfo.brokerArr.push(broker)
		}
		topoinfo.heartbeatmsg = onlineRealtimeData.toTopoArray()
	}
}

//日志订阅,登录即订阅，回调函数返回的数据存放在数组变量中。这样可以记录从登录到退出的所有日志。
let lognum = 0
let logmsg = []
function dispatchPublishLogMessage(jsonContent) {
	console.log('dispatchPublishLogMessage')
	const msgExpress = Cons.msgExpress
	logmsg[lognum] ={};
	for (var i = 0; i < jsonContent.length; i++) {
		if (jsonContent[i].key === msgExpress.KEY_NAME) {
			logmsg[lognum].name = jsonContent[i].value;
		} else if (jsonContent[i].key === msgExpress.KEY_LOGLEVEL) {
			logmsg[lognum].level = jsonContent[i].value;
		} else if (jsonContent[i].key === msgExpress.KEY_UUID) {
			logmsg[lognum].uuid = jsonContent[i].value;
		} else if (jsonContent[i].key === msgExpress.KEY_LOGDATA) {
			logmsg[lognum].data = jsonContent[i].value;
		}
	}
	var mydate = new Date();
	logmsg[lognum].time = mydate.format("yyyy-MM-dd hh:mm:ss");
	lognum++;
}

function dispatchPublishGatewayMessage(jsonContent) {
	console.log('dispatchPublishGatewayMessage')
	if(jsonContent) {
		//gwchange = true;
	}
}