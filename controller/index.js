import appClient from '../databus'
import store from '../utils/store'
import * as tradeAction from '../actions/tradeAction'
import * as tradeSettingAction from '../actions/tradeSettingAction'
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
      } else {
        store.dispatch(tradeSettingAction.update(result))
      }
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
    AsyncStorage.setItem('tradeSetting', data)
    store.dispatch(tradeSettingAction.update(data))
  }

  bid(code, price, setting) {
    const marketData = this.dispatch.htQuote()[code]
    if (!marketData) {
      return
    }
    this.updateTradeTips(code, '')
    if (Math.abs(price - marketData.dLastPrice) / marketData.dLastPrice > 0.01) {
      this.updateTradeTips(code, '价格偏离正常值！')
      return
    }
    const netPos = this.dispatch.getPosition(code)
    if (netPos > 0 && setting.noLimitedNetPosition === false) {
      this.updateTradeTips(code, '仓位超限！')
      return
    }
    const orderData = this.dispatch.getOrder(code, enTradeDir.TRADE_DIR_BUY, price)
    if (orderData) {
      this.modifyReq(orderData.orderId, price)
      return
    }

    if (setting.close) {
      this.orderReq(code, price, ORDER_TYPE.BUYTOCOVER)
    } else if (setting.open) {
      this.orderReq(code, price, ORDER_TYPE.BUY)
    } else {
      this.orderReq(code, price, ORDER_TYPE.SMARTBUY)
    }
  }

  ofr(code, price, setting) {
    const marketData = this.dispatch.htQuote()[code]
    if (!marketData) {
      return
    }

    this.updateTradeTips(code, '')
    if (Math.abs(price - marketData.dLastPrice) / marketData.dLastPrice > 0.01) {
      this.updateTradeTips(code, '价格偏离正常值！')
      return
    }
    const netPos = this.dispatch.getPosition(code)
    if (netPos > 0 && setting.noLimitedNetPosition === false) {
      this.updateTradeTips(code, '仓位超限！')
      return
    }

    if (setting.enableSellFirst === false && netPos < 1) {
      this.updateTradeTips(code, '禁止先开空单！')
      return
    }
    const orderData = this.dispatch.getOrder(code, enTradeDir.TRADE_DIR_SELL, price)
    if (orderData) {
      this.modifyReq(orderData.orderId, price)
      return
    }

    if (setting.close) {
      this.orderReq(code, price, ORDER_TYPE.SELL)
    } else if (setting.open) {
      this.orderReq(code, price, ORDER_TYPE.SELLSHORT)
    } else {
      this.orderReq(code, price, ORDER_TYPE.SMARTSELL)
    }
  }

  cancel(code, price) {
    this.dispatch.foreachOrder(code, (orderData) => {
      if (orderData.cancel === enTradeOrderStatus.TRADE_ORDER_STATUS_WAIT) {
        this.cancelReq(orderData.orderId)
      }
    })
  }
}

export default controller = new Controller(dispatchObj)