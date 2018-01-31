import { UPDATE_WINDOW_INFO } from '../constants/actionTypes'

const initData = {
  siderWidth: 0,
  width: window.innerWidth,
  height: window.innerHeight,
}

export default function tableinfo(state = initData, action) {
  switch(action.type) {
    case UPDATE_WINDOW_INFO:
      return Object.assign({}, state, action.data)
    default:
      return state
  }
}

