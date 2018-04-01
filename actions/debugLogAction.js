import { ADD_DEBUG_LOG } from '../constants/actionTypes'

export const add = (data) => {
    return {
      type: ADD_DEBUG_LOG,
      data
    }
  }
  