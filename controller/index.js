import cbus from '../databus'
import store from '../utils/store'
import * as capitalStateAction from '../actions/capitalStateAction'
import * as tradeAction from '../actions/tradeAction'
import * as marketAction from '../actions/marketAction'
import * as orderAction from '../actions/orderAction'
import * as tradeSettingAction from '../actions/tradeSettingAction'
import * as localConfigAction from '../actions/localConfigAction'
import * as debugLogAction from '../actions/debugLogAction'
import { ToastAndroid, AsyncStorage } from 'react-native'
import dispatchObj from './dispatch'
import defaultConfig from '../config'
import { 
  enTradeDir,
  enTradeOrderStatus,
  ORDER_TYPE,
} from '../constants'

class Controller {
  constructor(dispatch) {
    this.dispatch = dispatch
    this.lastConfig = null;

    setInterval(() => {
      store.dispatch(localConfigAction.updateReadyState(cbus.readyState()))
    }, 1000)

    cbus.initProtoJson([
      { name: 'msgexpress', json: require('../databus/protobuf/msgexpress.json') },
      { name: 'trade', json: require('../databus/protobuf/trade.json') },
      { name: 'stockserver', json: require('../databus/protobuf/stockserver.json') }
    ]);

    const self = this;
    cbus.setEvent(
      function onopen() {
        ToastAndroid.show('连接成功', ToastAndroid.SHORT);
      },
      function onclose(event) {
        ToastAndroid.show('连接关闭' + (event && event.code ? '（event.code）' : ''), ToastAndroid.SHORT);
      },
      function onerror(event) {
        ToastAndroid.show('连接出错', ToastAndroid.SHORT);
      },
      function onlogin(result) {
        setTimeout(() => {
          console.log('onlogin result', result);
          if (result && result === 'success' && self.lastConfig) {
            cbus.post('Trade.LoginReq', {
              userid: self.lastConfig.username, 
              passwd: self.lastConfig.password,
              instruments: self.lastConfig.codeList
            }).then((json) => {
              if (json.retCode !== 0) {
                ToastAndroid.show('Trade登录失败：' + json.msg, ToastAndroid.SHORT);   
              }
            }).catch(err => {
              ToastAndroid.show('Trade登录失败' + err ? (':' + err) : '', ToastAndroid.SHORT);
            })
          }
        }, 2000);
      }
    )

    cbus.setPublish(this.dispatch.handle)
  }

  init() {
    AsyncStorage.getItem('tradeSetting', (err, result) => {
      if (err) {
        console.log(err)
      } else if (result) {
        store.dispatch(tradeSettingAction.update(JSON.parse(result)))
      }
    })

    try {
      AsyncStorage.getItem('localConfig', (err, result) => {
        let config = defaultConfig
        if (err) {
          console.log(err)
        } else if (result) {
          const localConfig = JSON.parse(result)
          if (localConfig && localConfig.wsip && localConfig.wsport) {
            store.dispatch(localConfigAction.update(localConfig))
            config = localConfig
          }
        }
        this.start(config)
      })
    } catch (err) {
      console.log('get localConfig error', err)
      this.start(defaultConfig)
    }
  }

  start(config) {
    console.log('start', config);
    this.lastConfig = JSON.parse(JSON.stringify(config));
    this.dispatch.initTradeList(config.codeList, config.lock)
    const self = this
    console.log('start', config)
    return new Promise((resolve, reject) => {
      cbus.open(`ws://${config.wsip}:${config.wsport}`)
      .then((json) => {
        resolve(json)
      })
      .catch((err) => {
        console.error(JSON.stringify(err))
        reject(err)
      })
    })
  }

  clearAllData() {
    this.dispatch.clear()
    store.dispatch(capitalStateAction.clear())
    store.dispatch(marketAction.clear())
    store.dispatch(tradeAction.clear())
    store.dispatch(orderAction.clear())
  }

  close() {
    cbus.close()
    this.clearAllData()
  }

  restart(config) {
    this.close()
    return this.start(config)
  }

  logout() {
    return cbus.post('Trade.LogoutReq', {})
  }

  relogin(config) {
    this.clearAllData()
    this.dispatch.initTradeList(config.codeList, config.lock || 'unlock')
    return cbus.post('Trade.LoginReq', {
      userid: config.username, 
      passwd: config.password,
      instruments: config.codeList
    })
  }

  // 处理推送
  handleDispatch(data) {
    this.dispatch.handle(data)
  }

  cancelReq(orderId) {
    return cbus.post('Trade.CancelReq', {
      orderid: orderId
    })
  }

  modifyReq(orderId, price) {
    return cbus.post('Trade.ModifyReq', {
      orderid: orderId,
      price: price
    })
  }

  orderReq(code, price, type) {
    return cbus.post('Trade.OrderReq', {
      code: code,
      price: price,
      type: type
    })
  }

  updateSetting(data) {
    AsyncStorage.setItem('tradeSetting', JSON.stringify(data))
    store.dispatch(tradeSettingAction.update(data))
  }

  updateLocalConfig(data) {
    AsyncStorage.setItem('localConfig', JSON.stringify(data))
    store.dispatch(localConfigAction.update(data))
    this.dispatch.setTradeListLock(data.lock)
  }

  bid(code, price, setting) {
    const marketData = this.dispatch.htQuote()[code]
    if (!marketData) {
      console.log('market is not find', code)
      return
    }

    if (Math.abs(price - marketData.dLastPrice) / marketData.dLastPrice > 0.01) {
      ToastAndroid.show('价格偏离正常值！', ToastAndroid.SHORT);
      return
    }
    const netPos = this.dispatch.getPosition(code)
    if (netPos > 0 && setting.noLimitedNetPosition === false) {
      ToastAndroid.show('仓位超限！', ToastAndroid.SHORT);
      return
    }
    const orderData = this.dispatch.getOrder(code, enTradeDir.TRADE_DIR_BUY)
    if (orderData) {
      this.modifyReq(orderData.nOrderID, price).then(json => {
        if (json.retCode !== 0 && json.msg && json.msg.length) {
          ToastAndroid.show(json.msg, ToastAndroid.SHORT);
        }
      })
      return
    }

    let type = ORDER_TYPE.SMARTBUY
    if (setting.close) {
      type = ORDER_TYPE.BUYTOCOVER
    } else if (setting.open) {
      type = ORDER_TYPE.BUY
    }
    this.orderReq(code, price, type).then(json => {
      if (json.retCode !== 0 && json.msg && json.msg.length) {
        ToastAndroid.show(json.msg, ToastAndroid.SHORT);
      }
    })
  }

  ofr(code, price, setting) {
    const marketData = this.dispatch.htQuote()[code]
    if (!marketData) {
      return
    }

    if (Math.abs(price - marketData.dLastPrice) / marketData.dLastPrice > 0.01) {
      ToastAndroid.show('价格偏离正常值！', ToastAndroid.SHORT);
      return
    }
    const netPos = this.dispatch.getPosition(code)
    if (netPos < 0) {
      ToastAndroid.show('仓位超限！', ToastAndroid.SHORT);
      return
    }

    if (setting.enableSellFirst === false && netPos < 1) {
      ToastAndroid.show('禁止先开空单！', ToastAndroid.SHORT);
      return
    }
    const orderData = this.dispatch.getOrder(code, enTradeDir.TRADE_DIR_SELL)
    if (orderData) {
      this.modifyReq(orderData.nOrderID, price).then(json => {
        if (json.retCode !== 0 && json.msg && json.msg.length) {
          ToastAndroid.show(json.msg, ToastAndroid.SHORT);
        }
      })
      return
    }
    
    let type = ORDER_TYPE.SMARTSELL
    if (setting.close) {
      type = ORDER_TYPE.SELL
    } else if (setting.open) {
      type = ORDER_TYPE.SELLSHORT
    }
    this.orderReq(code, price, type).then(json => {
      if (json.retCode !== 0 && json.msg && json.msg.length) {
        ToastAndroid.show(json.msg, ToastAndroid.SHORT);
      }
    })
  }

  cancel(code, price) {
    this.dispatch.foreachOrder(code, (orderData) => {
      if (orderData.nOrderStatus === enTradeOrderStatus.TRADE_ORDER_STATUS_WAIT) {
        this.cancelReq(orderData.nOrderID).then(json => {
          if (json.retCode !== 0 && josn.msg && json.msg.length) {
            ToastAndroid.show(json.msg, ToastAndroid.SHORT);
          }
        })
      }
    })
  }

  addLog(text) {
    store.dispatch(debugLogAction.add(text))
  }
}

export default controller = new Controller(dispatchObj)