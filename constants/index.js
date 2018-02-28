export const MARKET_TITLE = '当前持仓'
export const ORDER_TITLE = '当日订单'

// 交易类型(投机, 套利, 套保)
export const enTradeType = {
    TRADE_TYPE_SPECULATION: 0,      // 投机
    TRADE_TYPE_ARBITRAGE: 1,        // 套利
    TRADE_TYPE_HEDGE: 2,            // 套保
}

// 交易买卖方向类型(买, 卖)
export const enTradeDir = {
    TRADE_DIR_BUY: 0,               // 买
    TRADE_DIR_SELL: 1,              // 卖
}

// 交易开平类型
export const enTradeOperate = {
    TRADE_OPERATE_OPEN: 0,          // 开仓
    TRADE_OPERATE_CLOSE: 1,         // 平仓
    TRADE_OPERATE_CLOSE_TODAY: 2,   // 平今
    TRADE_OPERATE_EXCUTE: 3,        // 期权行权
}

// 交易报单类型
export const enTradeOrderType = {
    TRADE_ORDER_TYPE_LIMIT: 0,      // 限价单
    TRADE_ORDER_TYPE_MARKET: 1,     // 市价单
    TRADE_ORDER_TYPE_FAK: 2,        // 部成即撤
    TRADE_ORDER_TYPE_FOK: 3,        // 全成全撤
}

// 交易报单状态
export const enTradeOrderStatus = {
    TRADE_ORDER_STATUS_UNKNOW: 0,	    // 未知
    TRADE_ORDER_STATUS_PARTIAL: 1,      // 部分成交
    TRADE_ORDER_STATUS_NOTPARTIAL: 2,	// 部分成交不在队列
    TRADE_ORDER_STATUS_WAIT: 3,			// 委托
    TRADE_ORDER_STATUS_NOTWAIT: 4,		// 不在委托
    TRADE_ORDER_STATUS_TRADED: 5,       // 全部成交
    TRADE_ORDER_STATUS_CANCELED: 6,     // 撤单
}

// 交易商品类型
export const enProductType = {
    PRODUCT_TYPE_FUTURES: 0,            // 期货
    PRODUCT_TYPE_OPTIONS: 1,            // 期货期权
    PRODUCT_TYPE_COMBINATION: 2,        // 组合
    PRODUCT_TYPE_SPOT: 3,               // 即期
    PRODUCT_TYPE_EFP: 4,                // 期转现
    PRODUCT_TYPE_SPOT_OPTION: 5,        // 现货期权
}

//-------------------------------------------------------------------------------------------
//报单数据
//-------------------------------------------------------------------------------------------

export const PRICE_TYPE = {
    LIMIT: 0,		        //限价单
    MARKET: 1,			    //市价单
}

export const ORDER_TYPE = {
    BUY: 1,		            //多开
    SELLSHORT: 2,		    //空开
    SELL: 3,		        //平多
    BUYTOCOVER: 4,		    //平空

    //扩展
    SMARTBUY: 5,			//没有今仓且有昨空头仓，则平空，如果有今仓或无空头仓，则多开
    SMARTSELL: 6,			//没有今仓且有昨多头仓，则平多，如果有今仓或无多头仓，则空开
}