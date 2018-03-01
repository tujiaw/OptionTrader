import { UPDATE_TRADE_DATA, CLEAR_TRADE_DATA } from '../constants/actionTypes'
import * as _ from 'lodash'

const initData = []
export default function orderData(state = initData, action) {
  switch (action.type) {
    case UPDATE_TRADE_DATA:
    {
      if (action.data.code) {
        const oldList = _.cloneDeep(state)
        const f = _.find(oldList, item => item.code === action.data.code)
        if (f) {
          Object.assign(f, action.data)
        } else {
          oldList.push(action.data)
        }
        return oldList
      }
      return state
    }
    case CLEAR_TRADE_DATA:
    {
      return initData
    }
    default:
      return state
  }
}
