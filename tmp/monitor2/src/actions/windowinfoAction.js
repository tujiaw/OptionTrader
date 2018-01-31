import { UPDATE_WINDOW_INFO } from '../constants/actionTypes'

export const update = (data) => {
  return {
    type: UPDATE_WINDOW_INFO,
    data
  }
}