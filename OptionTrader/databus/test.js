import store from '../utils/store'
import * as capitalStateAction from '../actions/capitalStateAction'
import * as marketAction from '../actions/marketAction'
import * as orderAction from '../actions/orderAction'

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
        const initList = [{
            dataType: '市场',
            code: 'IC1802',
            price: '1279.2',
            dir: '空',
            total: 0,
            yesday: 1,
            today: 0,
            avgPrice: '6307.2',
            profit: '880',
        }]
        store.dispatch(marketAction.update(initList))
    }, 5000)

    // setInterval(() => {
    //     const initList = [{
    //         dataType: '成交',
    //         ordertime: '14:37:31',
    //         code: 'IC1802',
    //         price: '6307.2',
    //         dir: '买',
    //         operate: 'close',
    //         status: 'traded',
    //         tradeTime: '14:37:54',
    //         cancel: ''
    //     }]
    //     store.dispatch(orderAction.update(initList))
    // }, 7000)
}
