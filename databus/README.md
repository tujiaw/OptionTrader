这是总线库的JavaScript客户端版本，通过WebSocket实现了JavaScript与总线之间的连接，通过总线可以很方便与各后台服务进行通信。其中包括收发消息，订阅消息，断线重连以及支持多IP。

支持如下三种环境:
* browsers
* react
* react-native

# 准备工作
必须先生成cbusCommand.js文件，它存储了消息名与ID之间的映射，package名与proto文件名之间的映射   

先确保databus目录下有Command.xml文件，protobuf目录下放置所有proto文件，然后就可以使用nodejs执行cbusGenerateCommand.js文件生成cbusCommand.js。

执行cbusGenerateCommand.js做两件事情：
1. 将Command.xml转换为json写入cbusCommand.js;
2. 读取protobuf目录下的.proto文件将package名字和proto文件名映射关系写入cbusCommand.js  

node执行js，如：```node cbusGenerateCommand.js```

# browsers使用方式
参考webtest.html示例  
直接将databus目录拷贝到tomcat中webapps目录下，在浏览器上访问http://localhost:8080/databus/webtest.html，点击open按钮创建连接初始化信息，点击hello按钮发送消息。浏览器上正确显示日志表示成功。

# react使用方式
## 安装依赖库
将下面第三方库加入到项目的package.json的dependencies中，然后: npm install
```
"bytebuffer": "^5.0.1",
"long": "^3.2.0",
"pako": "^1.0.6",
"protobufjs": "^6.7.0",
"xml2js": "^0.4.19",
```

## 使用代码片段
使用databus/index.js中ClientBus类就可以了
```
import cbus from '../databus'

// 1. 设置推送回调
cbus.setPublish((data) => {
  console.log(data);
})

// 2. 打开连接（内部会自动登录总线和订阅）
// 支持多IP，也可以传入单个IP，如：'ws://172.16.66.87:1111'
cbus.open(
  ['ws://172.16.66.87:1111', 'ws://172.16.66.87:8888'], 
  ['HelloServer.HelloSub, MsgExpress.CommonResponse',]
).then(json => {
  console.log('open', json);
}).catch((err) => {
  console.log(JSON.stringify(err))
})

// 3. 发送消息
cbus.post('HelloServer.HelloReq', 'HelloServer.HelloRsp', {
  name: 'hello'
}).then((json) => {
  console.log(json);
}).catch((err) => {
  console.log(err)
})
```

# react native使用方法
与react基本相同，区别在于：
* react native中protobufjs需要降级为6.7.0（也可以尝试下6.8.0），否则enum会出错  
* 使用protobufjs提供的命令行将proto文件转换为json文件，然后调用databus的initProtoJson接口初始化  

```
pbjs -t json msgexpress.proto > msgexpress.json
```
> 原因是：react native中protobufjs没办法直接读取proto文件

# nodejs使用方法
安装```npm install websocket --save```  
```
const cbus = require('./databus')
cbus.setPublish(function(data) {
  console.log(data);
})
cbus.setProtoFileDir(__dirname + '/databus/protobuf');
cbus.open('ws://172.16.66.87:1111', ['HelloServer.HelloSub, MsgExpress.CommonResponse'])
.then(json => {
  console.log(json);
  setInterval(() => {
    cbus.post('HelloServer.HelloReq', 'HelloServer.HelloRsp', {
      name: 'nodejs'
    }).then((json) => {
      console.log(json);
    }).catch(err => {
      console.log(err);
    })
  }, 3000);
}).catch(err => {
  console.log(err);
})
```

# 测试
## 推送
|推送频率(ms) |观察条数  |平均时间(ms)
|:-:         |:-:      |:-:
|100         |1000     |115
|200         |1000     |33
|1000        |330      |24

## 收发消息
收到消息的时间不均衡，有的几毫秒有的几十上百毫秒

|发送频率(ms) |观察条数 |平均时间(ms)
|:-:         |:-:      |:-:
|100         |2000     |48
|200         |2000     |51
|1000        |200      |38


## 推送和收发一起
频率100ms，收发消息在3800条时连接断开，broker崩溃  
频率200ms，收发消息在369条，推送消息在654条，心跳失败  
推送500ms，请求200ms，收到应答数2050时，心跳超时  

|推送频率(ms) |推送条数 |推送平均时间(ms) |发送频率(ms) |发送条数 |收发平均时间(ms)
|:-:         |:-:      |:-:            |:-:         |:-:     |:-:
|200         |2200     |90             |200         |2400    |109
|200         |2000     |70             |500         |1000    |126
|500         |1600     |73             |200         |4000    |90
|500         |1600     |34             |500         |1000    |16
|500         |1000     |28             |500         |500     |23
|1000        |1380     |35             |1000        |1400    |15

