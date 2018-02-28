import { UPDATE_TRADE_SETTING } from '../constants/actionTypes'

export const update = (data) => {
    return {
      type: UPDATE_TRADE_SETTING,
      data
    }
  }
  