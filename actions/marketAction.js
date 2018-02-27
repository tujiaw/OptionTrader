import { UPDATE_MARKET_DATA, UPDATE_EXIST_MARKET_DATA } from '../constants/actionTypes'

export const update = (data) => {
    return {
        type: UPDATE_MARKET_DATA,
        data
    }
}

export const updateIfExist = (data) => {
    return {
        type: UPDATE_EXIST_MARKET_DATA,
        data
    }
}
