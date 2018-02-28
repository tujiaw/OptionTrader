import { UPDATE_TRADE_SETTING } from '../constants/actionTypes'

const initData = {
  enableSellFirst: false,
  noLimitedNetPosition: false,
  open: false,
  close: false
}

export default function tradeSetting(state = initData, action) {
  switch(action.type) {
    case UPDATE_TRADE_SETTING:
    {
      return Object.assign({}, state, action.data)
    }
    default:
      return state
  }
}
