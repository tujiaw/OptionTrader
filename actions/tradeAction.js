import { UPDATE_TRADE_DATA, CLEAR_TRADE_DATA, UPDATE_TRADE_TIPS } from '../constants/actionTypes'

export const update = (data) => {
  return {
    type: UPDATE_TRADE_DATA,
    data
  }
}

export const clear = (data) => {
  return {
      type: CLEAR_TRADE_DATA,
      data
  }
}

export const updateTips = (data) => {
  return {
    type: UPDATE_TRADE_TIPS,
    data
  }
}
