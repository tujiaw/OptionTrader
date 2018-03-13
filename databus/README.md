# 安装依赖库
react native中protobufjs要用6.7.0老版本的，否则enum会出错，其他的用最新版就可以了。
将下面第三方库加入到项目的package.json的dependencies中，然后: npm install
```
"bytebuffer": "^5.0.1",
"long": "^3.2.0",
"pako": "^1.0.6",
"protobufjs": "^6.7.0",
"xml2js": "^0.4.19",
"lodash": "^4.17.5"
```

# 生成Command.js文件
使用genCommand.js将Command.xml转换成Command.js，首先确保genCommand.js中的protoDir目录是对的，然后使用node执行此js文件，如：
```
node genCommand.js
```

# databus使用方法
使用databus/index.js中AppClient类就可以了
```
import appClient from '../databus'

// 连接并初始化
appClient.open(config.wsip, config.wsport)
    .then((json) => {
        return appClient.subscribe([
            'StockServer.StockDataRequest, StockServer.StockDataResponse',
            'Trade.TradingAccount, MsgExpress.CommonResponse', 
            'Trade.MarketData, MsgExpress.CommonResponse',
            'Trade.Position, MsgExpress.CommonResponse',
            'Trade.Order, MsgExpress.CommonResponse',
            'Trade.Trade, MsgExpress.CommonResponse',
            'Trade.ErrorInfo, MsgExpress.CommonResponse'
        ], (data) => {
            // 处理推送
            this.handleDispatch(data)
        })
    })
    .then((json) => {
        console.log('subscribe result', json)
        return appClient.post('Trade.LoginReq', 'Trade.LoginResp', {
            userid: config.username, 
            passwd: config.password,
            instruments: config.codeList
        })
    })
    .then((json) => {
        console.log('login trade', json)
        resolve(json)
    })
    .catch((err) => {
        console.log(JSON.stringify(err))
        reject(err)
    })

// 发送消息
appClient.post('Trade.ModifyReq', 'Trade.ModifyResp', {
    orderid: orderId,
    price: price
}).then(json => {
    // 应答
})
```



