import { combineReducers } from 'redux'
import capitalStateData from './capitalStateData'
import marketData from './marketData'
import orderData from './orderData'
import tradeData from './tradeData'

const reducers = combineReducers({
    capitalStateData,
    marketData,
    orderData,
    tradeData,
})

export default reducers