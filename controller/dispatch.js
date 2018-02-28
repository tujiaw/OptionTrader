import store from '../utils/store'
import * as capitalStateAction from '../actions/capitalStateAction'
import * as marketAction from '../actions/marketAction'
import * as orderAction from '../actions/orderAction'
import * as tradeAction from '../actions/tradeAction'
import { 
  MARKET_TITLE, 
  ORDER_TITLE,
  enTradeDir,
  enTradeOperate,
  enTradeOrderStatus,
} from '../constants'

const g_htQuote = {}
const g_htPosition = {}
const g_htOrder = {}
const g_htTrade = {}

function getKey(code, dir) {
  return code + ':' + dir
}

function getShowTraderDir(dir) {
  if (dir === 0) {
    return '多'
  } else if (dir === 1) {
    return '空'
  } else {
    return '--'
  }
}

function getShowOrderDir(dir) {
  if (dir === enTradeDir.TRADE_DIR_BUY) {
    return '买'
  } else if (dir === enTradeDir.TRADE_DIR_SELL) {
    return '卖'
  } else {
    return '--'
  }
}

function getShowOperate(tradeOperate) {
  if (tradeOperate === enTradeOperate.TRADE_OPERATE_OPEN) {
    return 'open'
  } else if (tradeOperate === enTradeOperate.TRADE_OPERATE_CLOSE) {
    return 'close'
  } else if (tradeOperate === enTradeOperate.TRADE_OPERATE_CLOSE_TODAY) {
    return 'close today'
  } else {
    return '--'
  }
}

function getShowOrderStatus(status) {
  if (status === enTradeOrderStatus.TRADE_ORDER_STATUS_UNKNOW) {
    return 'unknow'
  } else if (status === enTradeOrderStatus.TRADE_ORDER_STATUS_UNKNOW) {
    return 'wait'
  } else if (status === enTradeOrderStatus.TRADE_ORDER_STATUS_NOTWAIT) {
    return 'not wait'
  } else if (status === enTradeOrderStatus.TRADE_ORDER_STATUS_TRADED) {
    return 'traded'
  } else if (status === enTradeOrderStatus.TRADE_ORDER_STATUS_CANCELED) {
    return 'cancel'
  } else if (status === enTradeOrderStatus.TRADE_ORDER_STATUS_PARTIAL) {
    return 'partial'
  } else if (status === enTradeOrderStatus.TRADE_ORDER_STATUS_NOTPARTIAL) {
    return 'not partial'
  } else {
    return '--'
  }
}

function getPrice(code) {
  const upperCode = code.toUpperCase()
  if (upperCode.indexOf('IF') === 0 || upperCode.indexOf('IH') === 0) {
    return 300
  } else if (upperCode.indexOf('IC') === 0) {
    return 200
  } else {
    return 0
  }
}

const dispatchObj = {
  htQuote: () => {
    return g_htQuote
  },
  htPosition: () => {
    return g_htPosition
  },
  htOrder: () => {
    return g_htOrder
  },
  htTrade: () => {
    return g_htTrade
  },
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
    const code = content.szINSTRUMENT.trim()
    if (!(code && code.length)) {
      console.error('Trade.MarketData', content)
      return
    }
    g_htQuote[code] = content

    const key0 = getKey(code, 0)
    const key1 = getKey(code, 1)
    if (g_htPosition[key0]) {
      const p0 = g_htPosition[key0]
      const marketData = { dataType: MARKET_TITLE, code: code, dir: getShowTraderDir(0), price: content.dLastPrice }
      if (getPrice(code) > 0 && p0.nPosition > 0) {
        marketData.profit = (content.dLastPrice - p0.dAvgPrice / getPrice(code) / p0.nPosition) * p0.nPosition
        marketData.profit = marketData.profit.toFixed(1)
      }
      store.dispatch(marketAction.updateIfExist(marketData))
    }
    if (g_htPosition[key1]) {
      const p1 = g_htPosition[key1]
      const marketData = { dataType: MARKET_TITLE, code: code, dir: getShowTraderDir(1), price: content.dLastPrice }
      if (getPrice(code) > 0 && p1.nPosition > 0) {
        marketData.profit = (p1.dAvgPrice / getPrice(code) / p1.nPosition - content.dLastPrice) * p1.nPosition
        marketData.profit = marketData.profit.toFixed(1)
      }
      store.dispatch(marketAction.updateIfExist(marketData))
    }

    const tradeData = {
        code: code,
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
    g_htOrder[content.nOrderID] = content

    const orderData = {
      dataType: ORDER_TITLE,
      orderId: content.nOrderID,
      orderTime: content.szInsertDateTime,
      code: code,
      price: content.dLimitPrice,
      dir: getShowOrderDir(content.nTradeDir),
      operate: getShowOperate(content.nTradeOperate),
      status: getShowOrderStatus(content.nOrderStatus),
      tradeTime: content.szTradeDateTime,
      cancel: getShowOrderStatus(content.nOrderStatus),
    }
    store.dispatch(orderAction.update(orderData))
  },
  'Trade.Trade': (content) => {
    if (!(content.nOrderID)) {
      console.error('Trade.Trade', content)
      return
    }
    g_htTrade[content.nOrderID] = content
  },
  'Trade.Position': (content) => {
    const code = content.szINSTRUMENT.trim()
    if (!(code && code.length && content.hasOwnProperty('nTradeDir'))) {
      console.error('Trade.Position', content)
      return
    }
    const key = getKey(code, content.nTradeDir)
    g_htPosition[key] = content

    let avgPrice = content.dAvgPrice
    if (code.toUpperCase().indexOf('IC') >= 0) {
      avgPrice /= 200
    } else {
      avgPrice /= 300
    }
    avgPrice = avgPrice.toFixed(1)

    const marketData = {
      dataType: MARKET_TITLE,
      code: code,
      price: content.dLastPrice,
      dir: getShowTraderDir(content.nTradeDir),
      total: content.nPosition,
      yesday: content.nYesterdayPosition,
      today: content.nTodayPosition,
      avgPrice: avgPrice,
    }
    store.dispatch(marketAction.update(marketData))
  },
  getPosition: (code) => {
    let netPos = 0
    const key0 = getKey(code, enTradeDir.TRADE_DIR_BUY)
    if (g_htPosition[key0]) {
      netPos = g_htPosition[key0].nPosition
    }
    const key1 = getKey(code, enTradeDir.TRADE_DIR_SELL)
    if (g_htPosition[key1]) {
      netPos -= g_htPosition[key1].nPosition
    }
    return netPos
  },
  getOrder: (code, dir, isWaitStatus = true) => {
    for (let key in g_htOrder) {
      if (g_htOrder[key].code === code && g_htOrder[key].dir === dir) {
        if (isWaitStatus) {
          if (g_htOrder[key].status === enTradeOrderStatus.TRADE_ORDER_STATUS_WAIT) {
            return {...g_htOrder[key]}
          }
        } else {
          return {...g_htOrder[key]}
        }
      }
    }
    return null
  },
  foreachOrder: (code, cb) => {
    for (let key in g_htOrder) {
      if (g_htOrder[key].code === code) {
        cb(g_htOrder[key])
      }
    }
  }
}

export default dispatchObj
