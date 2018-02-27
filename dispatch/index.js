import store from '../utils/store'
import * as capitalStateAction from '../actions/capitalStateAction'
import * as marketAction from '../actions/marketAction'
import * as orderAction from '../actions/orderAction'
import * as tradeAction from '../actions/tradeAction'
import { MARKET_TITLE, ORDER_TITLE } from '../constants'

const htQuote = {}
const htPosition = {}
const htOrder = {}
const htTrade = {}

function getKey(code, dir) {
  return code + ':' + dir
}

function getPrice(code) {
  const upperCode = code.toUpperCase()
  if (upperCode.startsWith('IF') || upperCode.startsWith('IH')) {
    return 300.0
  } else if (upperCode.startsWith('IC')) {
    return 200.0
  }
  return 0
}

const dispatchObj = {
  'Trade.TradingAccount': (content) => {
    const obj = {
      dynamicEquity: content.dDynamicEquity || 0 ,
      frozenCapital: content.dFrozenCapital || 0,
      avaiableCapital: content.dAvaiableCapital || 0
    }
    obj.dynamicEquity = obj.dynamicEquity.toFixed(2)
    obj.frozenCapital = obj.frozenCapital.toFixed(2)
    obj.avaiableCapital = obj.avaiableCapital.toFixed(2)
    store.dispatch(capitalStateAction.update(obj))
  },
  'Trade.MarketData': (content) => {
    const code = content.szINSTRUMENT
    if (!(code && code.length)) {
      console.error('Trade.MarketData', content)
      return
    }
    htQuote[code] = content

    const key0 = getKey(code, 0)
    const key1 = getKey(code, 1)
    if (htPosition[key0]) {
      const p0 = htPosition[key0]
      const marketData = { dataType: MARKET_TITLE, code: code, dir: 0, price: content.dLastPrice }
      marketData.profit = (content.dLastPrice - p0.dAvgPrice / getPrice(code) / p0.nPosition) * p0.nPosition
      store.dispatch(marketAction.updateIfExist(marketData))
    }
    if (htPosition[key1]) {
      const p1 = htPosition[key1]
      const marketData = { dataType: MARKET_TITLE, code: code, dir: 1, price: content.dLastPrice }
      marketData.profit = (p1.dAvgPrice / getPrice(code) / p1.nPosition - content.dLastPrice) * p1.nPosition
      store.dispatch(marketAction.updateIfExist(marketData))
    }

    const tradeData = {
        code: content.szINSTRUMENT,
        spotPrice: '00000',                 // 现货价格
        futuresMinusPostPrice: '00',        // 期货价格-现货价格
        morePosition: '0',                  // 当前品种的多单仓位
        emptyPosition: '0',                 // 当前品种的空单仓位
        lock: 'L',                          // 锁住或打开下单按钮和撤单按钮
        sellPrice: content.dAskPrice1,      // 卖价
        buyPrice: content.dBidPrice1,       // 买价
        sellVolume: content.nAskVolume1,    // 卖量
        buyVolume: content.nBidVolume1,     // 买量
        dealPrice: content.dLastPrice,      // 成交价
        placeOrderPrice: '',                // 下单价格
    }
    store.dispatch(tradeAction.update(tradeData))
  },
  'Trade.Order': (content) => {
    if (!(content.nOrderID)) {
      console.error('Trade.Order', content)
      return
    }
    htOrder[content.nOrderID] = content

    const orderData = {
      dataType: ORDER_TITLE,
      orderId: content.nOrderID,
      orderTime: content.szInsertDateTime,
      code: content.szINSTRUMENT,
      price: content.dLimitPrice,
      dir: content.nTradeDir,
      operate: content.nTradeOperate,
      status: content.nOrderStatus,
      tradeTime: content.szTradeDateTime,
      cancel: 'wait'
    }
    store.dispatch(orderAction.update(orderData))
  },
  'Trade.Trade': (content) => {
    if (!(content.nOrderID)) {
      console.error('Trade.Trade', content)
      return
    }
    htTrade[content.nOrderID] = content
  },
  'Trade.Position': (content) => {
    if (!(content.szINSTRUMENT && content.szINSTRUMENT.length && content.hasOwnProperty('nTradeDir'))) {
      console.error('Trade.Position', content)
      return
    }
    const key = getKey(content.szINSTRUMENT, content.nTradeDir)
    htPosition[key] = content

    const marketData = {
      dataType: MARKET_TITLE,
      code: content.szINSTRUMENT,
      price: content.dLastPrice,
      dir: content.nTradeDir,
      total: content.nPosition,
      yesday: content.nYesterdayPosition,
      today: content.nTodayPosition,
      avgPrice: content.dAvgPrice,
    }
    store.dispatch(marketAction.update(marketData))
  }
}

export default dispatchObj
