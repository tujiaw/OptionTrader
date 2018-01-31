# Monitor

# 工具
安装node.js(地址：https://nodejs.org/dist/v8.9.4/node-v8.9.4-x64.msi)

# 运行
1. 使用命令行工具，cd到工程目录（package.json所在目录）
2. 安装依赖库，在命令行工具中输入：npm install
3. 启动项目：npm start
4. 最后会自动在浏览器中的localhost:3000地址打开网页
> 上面两个命令都会有点慢

# 配置
所在文件：config/index.js  
配置项：wsip, wsport, path  
最终会组合成：ws://192.168.1.242:8080/WebSocketProxy/SocketServer  

# 按需加载antd
* 打开react-script/config/webpack.config.dev.js
* 找到“Process JS with Babel.”
* 在options中增加如下代码
```
plugins: [
	['import', { libraryName: 'antd', style: 'css' }],
],
```
