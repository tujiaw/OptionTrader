import { combineReducers } from 'redux'
import capitalStateData from './capitalStateData'
import marketData from './marketData'
import orderData from './orderData'
import tradeData from './tradeData'
import tradeSetting from './tradeSetting'
import localConfig from './localConfig'
import debugLogData from './debugLogData'

const reducers = combineReducers({
    capitalStateData,
    marketData,
    orderData,
    tradeData,
    tradeSetting,
    localConfig,
    debugLogData
})

export default reducers
