import { UPDATE_CAPITALSTATE_DATA } from '../constants/actionTypes'

export const update = (data) => {
    return {
        type: UPDATE_CAPITALSTATE_DATA,
        data
    }
}