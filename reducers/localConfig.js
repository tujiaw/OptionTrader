import { UPDATE_LOCAL_CONFIG, UPDATE_READY_STATE } from '../constants/actionTypes'
import { CONNECT_STATUS } from '../constants'
import defaultConfig from '../config'

export default function localConfig(state = defaultConfig, action) {
  switch(action.type) {
    case UPDATE_LOCAL_CONFIG:
    {
      return Object.assign({}, state, action.data)
    }
    case UPDATE_READY_STATE:
    {
      if (state.netStatus === action.data) {
        return state
      } else {
        return Object.assign({}, state, { netStatus: action.data })
      }
    }
    default:
      return state
  }
}
