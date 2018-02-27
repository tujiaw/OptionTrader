import { UPDATE_MARKET_DATA, UPDATE_EXIST_MARKET_DATA } from '../constants/actionTypes'
import { MARKET_TITLE } from '../constants'
import { isArray } from '../utils/tools'

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
        const newState = {...state}
        for (let i = 0; i < newState.data.length; i++) {
            if (newState.data[i].code === action.data.code && newState.data[i].dir === action.data.dir) {
                Object.assign(newState.data[i], action.data)
                return newState
            }
        }
        if (action.type === UPDATE_MARKET_DATA) {
            newState.data.push(action.data)
            return newState
        }
    }
    default:
      return state
  }
}

