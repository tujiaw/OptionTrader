import { UPDATE_ORDER_DATA, REMOVE_ORDER_FROM_ID, CLEAR_ORDER_DATA } from '../constants/actionTypes'

export const update = (data) => {
    return {
        type: UPDATE_ORDER_DATA,
        data
    }
}

export const remove = (orderId) => {
    return {
        type: REMOVE_ORDER_FROM_ID,
        orderId
    }
}

export const clear = (data) => {
    return {
        type: CLEAR_ORDER_DATA,
        data
    }
}