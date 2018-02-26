import store from '../utils/store'
import * as capitalStateAction from '../actions/capitalStateAction'
import * as marketAction from '../actions/marketAction'
import * as orderAction from '../actions/orderAction'
import * as tradeAction from '../actions/tradeAction'
import { MARKET_TITLE, ORDER_TITLE } from '../constants'

export default function testStart() {
    // setInterval(() => {
    //     const initData = {
    //         dynamicEquity: Math.round(Math.random() * 10000),
    //         frozenCapital: Math.round(Math.random() * 1000),
    //         avaiableCapital: Math.round(Math.random() * 100),
    //     }
    //     store.dispatch(capitalStateAction.update(initData))
    // }, 3000)

    setInterval(() => {
        const item = {
            dataType: MARKET_TITLE,
            instId: '',
            code: 'IC180',
            price: '1279.2',
            dir: '空',
            total: 0,
            yesday: 1,
            today: 0,
            avgPrice: '6307.2',
            profit: '880',
        }
        const initList = []
        for (let i = 0; i < 4; i++) {
            const obj = {...item}
            obj.code += i
            initList.push(obj)
        }
        store.dispatch(marketAction.update(initList))
    }, 3000)

    let s_orderId = 1
    setInterval(() => {
        const item = {
            dataType: ORDER_TITLE,
            orderId: 0,
            orderTime: '14:37:31',
            code: 'IC',
            price: '6307.2',
            dir: '买',
            operate: 'close',
            status: 'traded',
            tradeTime: '14:37:54',
            cancel: 'wait'
        }
        const initList = []
        for (let i = 0; i < 1; i++) {
            if (s_orderId === 50) {
                break;
            }
            const obj = {...item}
            obj.orderId = s_orderId++
            obj.code += s_orderId
            initList.push(obj)
        }
        if (initList.length > 0) {
            store.dispatch(orderAction.update(initList))
        }
    }, 5000)

    // let s_tradeCodeList = ['IC1802', 'IF1802', 'IH1802', 'IH1803']
    // setInterval(() => {
    //     for (let i = 0; i < s_tradeCodeList.length; i++) {
    //         const newItem = {
    //             code: s_tradeCodeList[i],
    //             spotPrice: 'C0000',                 // 现货价格
    //             futuresMinusPostPrice: '08',        // 期货价格-现货价格
    //             morePosition: '2',             // 当前品种的多单仓位
    //             emptyPosition: '1',           // 当前品种的空单仓位
    //             lock: 'L',                          // 锁住或打开下单按钮和撤单按钮
    //             sellPrice: 6000,                    // 卖价
    //             buyPrice: 8000,                     // 买价
    //             sellVolume: 0,                      // 卖量
    //             buyVolume: 0,                       // 买量
    //             dealPrice: 0,                       // 成交价
    //             placeOrderPrice: '',                // 下单价格
    //         }
    //         store.dispatch(tradeAction.update(newItem))
    //     }
    // }, 3000)
}
