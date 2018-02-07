# 安装依赖库
将下面第三方库加入到项目的package.json的dependencies中，然后: npm install
```
"bytebuffer": "^5.0.1",
"long": "^3.2.0",
"pako": "^1.0.6",
"protobufjs": "^6.8.3",
"xml2js": "^0.4.19"
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

appClient.open(...)
```