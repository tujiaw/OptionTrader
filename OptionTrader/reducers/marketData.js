import { UPDATE_MARKET_DATA } from '../constants/actionTypes'
import { isArray } from '../utils/tools'

const initData = {
    title: {
        name: '市场',
        columnList: ['code', 'price', 'dir', 'total', 'yeaday', 'today', 'avgPrice', 'profit'],
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
                if (newList[i].code === oldState.data[j].code) {
                    oldState.data[j] = newList[i]
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
    default:
      return state
  }
}

