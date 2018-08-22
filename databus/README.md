这是总线库的JavaScript客户端版本，通过WebSocket实现了JavaScript与总线之间的连接，通过总线可以很方便与各后台服务进行通信。其中包括收发消息，订阅消息，断线重连以及支持多IP。

支持如下三种环境:
* browsers
* react
* react-native

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
使用databus/index.js中AppClient类就可以了
```
import cbus from '../databus'

// 设置推送回调
cbus.setPublish((data) => {
  console.log(data);
})

// 打开连接（内部会自动登录总线和订阅）
// 支持多IP，也可以传入单个IP，如：'ws://172.16.66.87:1111'
cbus.open(
  ['ws://172.16.66.87:1111', 'ws://172.16.66.87:8888'], 
  ['HelloServer.HelloSub, MsgExpress.CommonResponse']
).then(json => {
  console.log('open', json);
}).catch((err) => {
  console.log(JSON.stringify(err))
})

// 发送消息
cbus.post('HelloServer.HelloReq', {
  name: 'hello'
}).then((json) => {
  console.log(json);
}).catch((err) => {
  console.log(err)
})
```

# react native使用方法
与react基本相同，区别在于：
* react native中protobufjs要用6.7.0老版本的，否则enum会出错  
* 使用protobufjs提供的命令行将proto文件转换为json文件，然后调用databus的initProtoJson接口初始化  

```
pbjs -t json file1.proto file2.proto > bundle.json
```
> 原因是：react native中protobufjs没办法直接读取proto文件


