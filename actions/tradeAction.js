import { UPDATE_TRADE_DATA } from '../constants/actionTypes'

export const update = (data) => {
  return {
    type: UPDATE_TRADE_DATA,
    data
  }
}
