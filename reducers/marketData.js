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
    {
        const oldState = {...state}
        const newList = []
        if (isArray(action.data)) {
            newList = action.data
        } else {
            newList.push(action.data)
        }

        for (let i = 0; i < newList.length; i++) {
            let isFind = false
            for (let j = 0; j < oldState.data.length; j++) {
                // code与dir确定唯一键
                if (newList[i].code === oldState.data[j].code && newList[i].dir === oldState.data[j].dir) {
                    Object.assign(oldState.data[j], newList[i])
                    isFind = true
                    break
                }
            }
            if (!isFind) {
                oldState.data.push(newList[i])
            }
        }
        return oldState
    }
    case UPDATE_EXIST_MARKET_DATA:
    {
        const oldState = {...state}
        for (let i = 0; i < oldState.data.length; i++) {
            if (oldState.data[i].code === action.data.code && oldState.data[i].dir === action.data.dir) {
                Object.assign(oldState.data[i], action.data)
                return oldState
            }
        }
    }
    default:
      return state
  }
}

