import { UPDATE_LOCAL_CONFIG, UPDATE_READY_STATE } from '../constants/actionTypes'
import { CONNECT_STATUS } from '../constants'

const initData = {
    wsip: '47.100.7.224',
    wsport: '55555',
    codeList: ['IC1803', 'IF1803', 'IH1803', 'i1805'],
    username: 'admin',
    password: 'admin',
    netStatus: CONNECT_STATUS.CLOSED,
}

export default function localConfig(state = initData, action) {
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
