import { UPDATE_ORDER_DATA, REMOVE_ORDER_FROM_ID } from '../constants/actionTypes'
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
    case REMOVE_ORDER_FROM_ID:
    {
        if (action.orderId) {
            const data = [...state.data]
            for (let i = 0; i < data.length; i++) {
                if (data[i].orderId === action.orderId) {
                    data.splice(i, 1)
                    return {...state, data}
                }
            }
        }
        return state
    }
    default:
      return state
  }
}

