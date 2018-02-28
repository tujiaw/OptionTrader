import { UPDATE_MARKET_DATA, UPDATE_EXIST_MARKET_DATA } from '../constants/actionTypes'
import { MARKET_TITLE } from '../constants'
import { isArray } from '../utils/tools'
import * as _ from 'lodash'

const initData = {
    title: {
        name: MARKET_TITLE,
        columnList: ['code', 'price', 'dir', 'total', 'yesday', 'today', 'avgPrice', 'profit'],
    },
    data: []
}

export default function marketData(state = initData, action) {
  switch(action.type) {
    case UPDATE_MARKET_DATA:
    case UPDATE_EXIST_MARKET_DATA:
    {
        const newState = _.cloneDeep(state)
        const f = _.find(newState.data, item => item.code === action.data.code && item.dir === action.data.dir)
        if (f) {
            Object.assign(f, action.data)
        } else if (action.type === UPDATE_MARKET_DATA) {
            newState.push(action.data)
        }
        return newState
    }
    default:
      return state
  }
}

