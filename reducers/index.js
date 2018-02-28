import { combineReducers } from 'redux'
import capitalStateData from './capitalStateData'
import marketData from './marketData'
import orderData from './orderData'
import tradeData from './tradeData'
import tradeSetting from './tradeSetting'

const reducers = combineReducers({
    capitalStateData,
    marketData,
    orderData,
    tradeData,
    tradeSetting,
})

export default reducers