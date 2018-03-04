import appClient from '../databus'
import store from '../utils/store'
import * as capitalStateAction from '../actions/capitalStateAction'
import * as tradeAction from '../actions/tradeAction'
import * as marketAction from '../actions/marketAction'
import * as orderAction from '../actions/orderAction'
import * as tradeSettingAction from '../actions/tradeSettingAction'
import * as localConfigAction from '../actions/localConfigAction'
import { ToastAndroid, AsyncStorage } from 'react-native'
import dispatchObj from './dispatch'
import { 
  enTradeDir,
  enTradeOrderStatus,
  ORDER_TYPE,
} from '../constants'

class Controller {
  constructor(dispatch) {
    this.dispatch = dispatch
    AsyncStorage.getItem('tradeSetting', (err, result) => {
      if (err) {
        console.log(err)
      } else if (result) {
        store.dispatch(tradeSettingAction.update(JSON.parse(result)))
      }
    })
    AsyncStorage.getItem('localConfig', (err, result) => {
      if (err) {
        console.log(err)
      } else if (result) {
        const localConfig = JSON.parse(result)
        store.dispatch(localConfigAction.update(localConfig))
        localConfig.codeList.forEach(code => {
          store.dispatch(tradeAction.update({ code: code }))
        })
      }
    })

    setInterval(() => {
      store.dispatch(localConfigAction.updateReadyState(appClient.readyState()))
    }, 1000)

    appClient.initProtoJson()
  }

  start(config) {
    // config.codeList.forEach(code => {
    //   store.dispatch(tradeAction.update({ code: code }))
    // })

    const self = this
    console.log('start', config)
    return new Promise((resolve, reject) => {
      appClient.open(config.wsip, config.wsport)
      .then((json) => {
        return appClient.subscribe([
          'Trade.TradingAccount', 
          'Trade.MarketData',
          'Trade.Position',
          'Trade.Order',
          'Trade.Trade',
          'Trade.ErrorInfo'
        ], (name, content) => {
          console.log('publish', name)
          self.handleDispatch(name, content)
        })
      })
      .then((json) => {
        console.log('subscribe result', json)
        return appClient.post('Trade.LoginReq', 'Trade.LoginResp', {
          userid: config.username, 
          passwd: config.password,
          instruments: config.codeList
        })
      })
      .then((json) => {
        console.log('login trade', json)
        resolve(json)
      })
      .catch((err) => {
        console.log(JSON.stringify(err))
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
    appClient.close()
    this.clearAllData()
  }

  restart(config) {
    this.close()
    return this.start(config)
  }

  logout() {
    return appClient.post('Trade.LogoutReq', 'Trade.LogoutResp', {})
  }

  relogin(config) {
    this.clearAllData()
    return appClient.post('Trade.LoginReq', 'Trade.LoginResp', {
      userid: config.username, 
      passwd: config.password,
      instruments: config.codeList
    })
  }

  // 处理推送
  handleDispatch(name, content) {
    if (this.dispatch[name]) {
      this.dispatch[name](content)
    }
  }

  cancelReq(orderId) {
    return appClient.post('Trade.CancelReq', 'Trade.CancelResp', {
      orderid: orderId
    })
  }

  modifyReq(orderId, price) {
    return appClient.post('Trade.ModifyReq', 'Trade.ModifyResp', {
      orderid: orderId,
      price: price
    })
  }

  orderReq(code, price, type) {
    return appClient.post('Trade.OrderReq', 'Trade.OrderResp', {
      code: code,
      price: price,
      type: type
    })
  }

  updateTradeTips(code, tips) {
    store.dispatch(tradeAction.update({ code: code, tips: tips}))
  }

  updateSetting(data) {
    AsyncStorage.setItem('tradeSetting', JSON.stringify(data))
    store.dispatch(tradeSettingAction.update(data))
  }

  updateLocalConfig(data) {
    AsyncStorage.setItem('localConfig', JSON.stringify(data))
    store.dispatch(localConfigAction.update(data))
  }

  bid(code, price, setting) {
    const marketData = this.dispatch.htQuote()[code]
    if (!marketData) {
      console.log('market is not find', code)
      return
    }
    this.updateTradeTips(code, '')
    if (Math.abs(price - marketData.dLastPrice) / marketData.dLastPrice > 0.01) {
      ToastAndroid.show('价格偏离正常值！', ToastAndroid.SHORT);
      return
    }
    const netPos = this.dispatch.getPosition(code)
    if (netPos > 0 && setting.noLimitedNetPosition === false) {
      ToastAndroid.show('仓位超限！', ToastAndroid.SHORT);
      return
    }
    const orderData = this.dispatch.getOrder(code, enTradeDir.TRADE_DIR_BUY, price)
    if (orderData) {
      this.modifyReq(orderData.orderId, price)
      return
    }

    let type = ORDER_TYPE.SMARTBUY
    if (setting.close) {
      type = ORDER_TYPE.BUYTOCOVER
    } else if (setting.open) {
      type = ORDER_TYPE.BUY
    }
    this.orderReq(code, price, type).then(json => {
      if (json.msg) {
        this.updateTradeTips(code, json.msg)
      }
    })
  }

  ofr(code, price, setting) {
    const marketData = this.dispatch.htQuote()[code]
    if (!marketData) {
      return
    }

    this.updateTradeTips(code, '')
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
    const orderData = this.dispatch.getOrder(code, enTradeDir.TRADE_DIR_SELL, price)
    if (orderData) {
      this.modifyReq(orderData.orderId, price)
      return
    }
    
    let type = ORDER_TYPE.SMARTSELL
    if (setting.close) {
      type = ORDER_TYPE.SELL
    } else if (setting.open) {
      type = ORDER_TYPE.SELLSHORT
    }
    this.orderReq(code, price, type).then(json => {
      if (json.msg) {
        this.updateTradeTips(code, json.msg)
      }
    })
  }

  cancel(code, price) {
    this.dispatch.foreachOrder(code, (orderData) => {
      if (orderData.cancel === enTradeOrderStatus.TRADE_ORDER_STATUS_WAIT) {
        this.cancelReq(orderData.orderId).then(json => {
          if (json.msg) {
            this.updateTradeTips(code, json.msg)
          }
        })
      }
    })
  }
}

export default controller = new Controller(dispatchObj)