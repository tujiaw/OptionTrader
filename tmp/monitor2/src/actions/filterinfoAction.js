import { UPDATE_FILTER_INFO } from '../constants/actionTypes'

export const update = (data) => {
  return {
    type: UPDATE_FILTER_INFO,
    data
  }
}