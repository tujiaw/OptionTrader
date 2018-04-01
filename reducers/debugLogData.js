import { ADD_DEBUG_LOG } from '../constants/actionTypes'
import * as _ from 'lodash'

const initData = ['debug log start----------------']
export default function capitalStateData(state = initData, action) {
  switch(action.type) {
    case ADD_DEBUG_LOG:
    {
        let newState = []
        if (state.length < 300) {
            newState = _.cloneDeep(state)
        }
        newState.push(action.data);
        return newState
    }
    default:
      return state
  }
}

