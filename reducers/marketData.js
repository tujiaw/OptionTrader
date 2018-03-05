import { UPDATE_MARKET_DATA, UPDATE_EXIST_MARKET_DATA, CLEAR_MARKET_DATA } from '../constants/actionTypes'
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
    {
        const newState = _.cloneDeep(state)
        const f = _.find(newState.data, item => item.code === action.data.code && item.dir === action.data.dir)
        if (f) {
            Object.assign(f, action.data)
        } else {
            newState.data.push(action.data)
        }
        return newState
    }
    case UPDATE_EXIST_MARKET_DATA:
    {
        const newState = _.cloneDeep(state)
        let newDataList = []
        if (isArray(action.data)) {
            newDataList = action.data
        } else {
            newDataList.push(action.data)
        }
        _.each(newDataList, (value) => {
            const f = _.find(newState.data, item => item.code === value.code && item.dir === value.dir)
            if (f) {
                Object.assign(f, value)
            }
        })
        return newState
    }
    case CLEAR_MARKET_DATA:
    {
        return initData
    }
    default:
      return state
  }
}

