import { UPDATE_TRADE_DATA, CLEAR_TRADE_DATA, UPDATE_TRADE_TIPS } from '../constants/actionTypes'
import { isArray } from '../utils/tools'
import * as _ from 'lodash'

const initData = []
export default function tradeData(state = initData, action) {
  switch (action.type) {
    case UPDATE_TRADE_DATA:
    {
      let dataList = []
      if (isArray(action.data)) {
        dataList = action.data
      } else {
        dataList.push(action.data)
      }

      const newList = _.cloneDeep(state)
      _.each(dataList, data => {
        if (data.code && data.code.length) {
          const f = _.find(newList, item => item.code === data.code)
          if (f) {
            Object.assign(f, data)
          } else {
            newList.push(data)
          }
        }
      })
      return newList
    }
    case CLEAR_TRADE_DATA:
    {
      return initData
    }
    case UPDATE_TRADE_TIPS:
    {
      if (action.data.code && action.data.code.length) {
        const newList = _.cloneDeep(state)
        const f = _.find(newList, item => item.code === action.data.code)
        if (f) {
          f.tips = action.data.tips
          return newList
        }
      }
      return state
    }
    default:
      return state
  }
}
