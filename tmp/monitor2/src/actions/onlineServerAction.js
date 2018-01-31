import { UPDATE_ONLINESERVER_REALTIME_DATA } from '../constants/actionTypes'

export const update = (data) => {
  return {
    type: UPDATE_ONLINESERVER_REALTIME_DATA,
    data
  }
}