import { combineReducers } from 'redux'
import  onlineServerRealtimeData from './onlineServerRealtimeData'
import windowinfo from './windowinfo'
import filterinfo from './filterinfo'

const reducers = combineReducers({
  onlineServerRealtimeData,
  windowinfo,
  filterinfo
})

export default reducers