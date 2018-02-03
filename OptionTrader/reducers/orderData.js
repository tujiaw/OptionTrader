import { UPDATE_ORDER_DATA } from '../constants/actionTypes'
import { isArray } from '../utils/tools'

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
    {
        const oldState = {...state}
        const newList = []
        if (isArray(action.data)) {
            newList = action.data
        } else {
            newList.push(action.data)
        }

        for (let i = 0; i < newList.length; i++) {
            oldState.data.push(newList[i])
        }
        return oldState
    }
    default:
      return state
  }
}

