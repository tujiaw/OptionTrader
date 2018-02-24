import { UPDATE_CAPITALSTATE_DATA } from '../constants/actionTypes'

const initData = {
  dynamicEquity: 0,
  frozenCapital: 0,
  avaiableCapital: 0,
}

export default function capitalStateData(state = initData, action) {
  switch(action.type) {
    case UPDATE_CAPITALSTATE_DATA:
      return {...action.data}
    default:
      return state
  }
}

