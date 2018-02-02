import { UPDATE_MARKET_DATA } from '../constants/actionTypes'

export const update = (data) => {
    return {
        type: UPDATE_MARKET_DATA,
        data
    }
}