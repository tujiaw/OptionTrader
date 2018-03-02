import { UPDATE_LOCAL_CONFIG, UPDATE_READY_STATE } from '../constants/actionTypes'

export const update = (data) => {
  return {
    type: UPDATE_LOCAL_CONFIG,
    data
  }
}

export const updateReadyState = (data) => {
  return {
    type: UPDATE_READY_STATE,
    data
  }
}