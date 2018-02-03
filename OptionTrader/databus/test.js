import store from '../utils/store'
import * as capitalStateAction from '../actions/capitalStateAction'
import * as marketAction from '../actions/marketAction'
import * as orderAction from '../actions/orderAction'
import { MARKET_TITLE, ORDER_TITLE } from '../constants'

export default function testStart() {
    setInterval(() => {
        const initData = {
            dynamicEquity: Math.round(Math.random() * 10000),
            frozenCapital: Math.round(Math.random() * 1000),
            avaiableCapital: Math.round(Math.random() * 100),
        }
        store.dispatch(capitalStateAction.update(initData))
    }, 3000)

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
}
