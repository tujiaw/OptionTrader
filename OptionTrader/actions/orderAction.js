import { UPDATE_ORDER_DATA } from '../constants/actionTypes'

export const update = (data) => {
    return {
        type: UPDATE_ORDER_DATA,
        data
    }
}