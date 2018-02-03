import { UPDATE_TRADE_DATA } from '../constants/actionTypes'

const initData = []
export default function orderData(state = initData, action) {
  switch (action.type) {
    case UPDATE_TRADE_DATA:
    {
      if (action.data.code) {
        const oldList = [...state]
        for (let i = 0; i < oldList.length; i++) {
          if (oldList[i].code === action.data.code) {
            oldList[i] = action.data
            return oldList
          }
        }
        oldList.push(action.data)
        return oldList
      }
      return state
    }
    default:
      return state
  }
}
