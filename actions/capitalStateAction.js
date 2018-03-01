import { UPDATE_CAPITALSTATE_DATA, CLEAR_CAPITALSTATE_DATA } from '../constants/actionTypes'

export const update = (data) => {
    return {
        type: UPDATE_CAPITALSTATE_DATA,
        data
    }
}

export const clear = (data) => {
    return {
        type: CLEAR_CAPITALSTATE_DATA,
        data
    }
}