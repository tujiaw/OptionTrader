import { UPDATE_ONLINESERVER_REALTIME_DATA } from '../constants/actionTypes'

export default function onlineServerRealtimeData(state = [], action) {
  switch(action.type) {
    case UPDATE_ONLINESERVER_REALTIME_DATA:
      return [...action.data]
    default:
      return state
  }
}