import { UPDATE_ORDER_DATA, REMOVE_ORDER_FROM_ID, CLEAR_ORDER_DATA } from '../constants/actionTypes'
import { ORDER_TITLE } from '../constants'
import { isArray } from '../utils/tools'
import * as _ from 'lodash'

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
        const newState = _.cloneDeep(state)
        const f = _.find(newState.data, item => item.orderId === action.data.orderId)
        if (f) {
            Object.assign(f, action.data)
        } else {
            newState.data.push(action.data)
        }
        return newState
    }
    case REMOVE_ORDER_FROM_ID:
    {
        if (action.orderId) {
            const newState = _.cloneDeep(state)
            _.remove(newState.data, item => item.orderId === action.orderId)
            return newState
        }
        return state
    }
    case CLEAR_ORDER_DATA:
    {
        return initData
    }
    default:
      return state
  }
}

