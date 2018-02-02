import { UPDATE_ORDER_DATA } from '../constants/actionTypes'

const initData = {
    title: {
        name: '成交',
        columnList: ['orderTime', 'code', 'price', 'dir', 'operate', 'status', 'tradeTime', 'cancel']
    },
    data: []
}

export default function orderData(state = initData, action) {
  switch(action.type) {
    case UPDATE_ORDER_DATA:
      return {...action.data}
    default:
      return state
  }
}

