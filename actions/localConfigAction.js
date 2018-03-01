import { UPDATE_LOCAL_CONFIG } from '../constants/actionTypes'

export const update = (data) => {
    return {
      type: UPDATE_LOCAL_CONFIG,
      data
    }
  }
  