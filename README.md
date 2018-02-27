
react-native -> ReactAndroid -> build.gradle下面加入

project.ext.vectoricons = [
    iconFontNames: [ 'MaterialIcons.ttf', 'EvilIcons.ttf' ] // Name of the font files you want to copy
]

apply from: "../../react-native-vector-icons/fonts.gradle"


14:25:08: Trade.Trade Object {
14:25:08:   "dPrice": 5998.4,
14:25:08:   "nOrderID": 6099,
14:25:08:   "nRequestID": 0,
14:25:08:   "nTradeDir": 0,
14:25:08:   "nTradeOperate": 0,
14:25:08:   "nVolume": 1,
14:25:08:   "szINSTRUMENT": "IC1803",
14:25:08:   "szTradeID": "       45816",
14:25:08:   "szTradeTime": "11:00:52",
14:25:08:   "szTradingDay": "20180227",
14:25:08: }

// Trade.MarketData
  //  "dAskPrice1": 551,
  //  "dAvgPrice": 54959.5811481107,
  //  "dBidPrice1": 550.5,
  //  "dLastPrice": 550.5,
  //  "dLowerLimitPrice": 506,
  //  "dOpenInt": 1476518,
  //  "dUpperLimitPrice": 594,
  //  "nAskVolume1": 3327,
  //  "nBidVolume1": 1071,
  //  "nUpdateMillisec": 0,
  //  "nVolume": 253216,
  //  "szINSTRUMENT": "i1805",
  //  "szUpdateTime": "20180226 21:59:21",

14:25:09: Trade.Position Object {
14:25:09:   "dAvgPrice": 106500,
14:25:09:   "dMargin": 0,
14:25:09:   "dPositionProfit": 350,
14:25:09:   "nPosition": 2,
14:25:09:   "nTodayPosition": 1,
14:25:09:   "nTradeDir": 1,
14:25:09:   "nYesterdayPosition": 1,
14:25:09:   "szINSTRUMENT": "i1805",
14:25:09: }

14:25:08: Trade.Order Object {
14:25:08:   "dAvgPrice": 0,
14:25:08:   "dLimitPrice": 546.5,
14:25:08:   "nOrderID": 320807,
14:25:08:   "nOrderStatus": 5,
14:25:08:   "nOrderSysID": 106370,
14:25:08:   "nRequestID": 10644,
14:25:08:   "nSessionID": -1237216985,
14:25:08:   "nTradeDir": 1,
14:25:08:   "nTradeOperate": 0,
14:25:08:   "nTradeType": 0,
14:25:08:   "nTradeVolume": 1,
14:25:08:   "nTradeVolumeLeft": 1,
14:25:08:   "nVolume": 1,
14:25:08:   "szINSTRUMENT": "i1805",
14:25:08:   "szInsertDateTime": "14:08:21",
14:25:08:   "szOrderRefCustom": "10644OPENCTP",
14:25:08:   "szTradeDateTime": "",
14:25:08: }