import { UPDATE_ORDER_DATA, REMOVE_ORDER_FROM_ID } from '../constants/actionTypes'
import { ORDER_TITLE } from '../constants'
import { isArray } from '../utils/tools'

const initData = {
    title: {
        name: ORDER_TITLE,
        columnList: ['orderTime', 'code', 'price', 'dir', 'operate', 'status', 'tradeTime', 'cancel']
    },
    data: []
}

export default function orderData(state = initData, action) {
  switch(action.type) {
    case UPDATE_ORDER_DATA:
    {
        const newState = {...state}
        for (let i = 0; i < newState.data.length; i++) {
            if (newState.data[i].orderId === action.data.orderId) {
                Object.assign(newState.data[i], action.data)
                return newState
            }
        }
        newState.data.push(action.data)
        return newState
    }
    case REMOVE_ORDER_FROM_ID:
    {
        if (action.orderId) {
            const newState = {...state}
            for (let i = 0; i < newState.data.length; i++) {
                if (newState.data[i].orderId === action.orderId) {
                    newState.data.splice(i, 1)
                    return newState
                }
            }
        }
        return state
    }
    default:
      return state
  }
}

