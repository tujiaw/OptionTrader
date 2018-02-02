import { combineReducers } from 'redux'
import capitalStateData from './capitalStateData'
import marketData from './marketData'
import orderData from './orderData'

const reducers = combineReducers({
    capitalStateData,
    marketData,
    orderData,
})

export default reducers