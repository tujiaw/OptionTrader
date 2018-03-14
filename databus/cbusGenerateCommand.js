var fs = require('fs'),
  xml2js = require('xml2js');


let template = `(function(global, factory) {
  if (typeof require === 'function' && typeof module === "object" && module && module["exports"])
    module['exports'] = (function() {
      return factory();
  })();
  else
    global["cbusCommand"] = factory();
})(this, function() {
  return {
    AppList: %AppList%,
    ProtoFileList: %ProtoFileList%
  }
});`

const parser = new xml2js.Parser();

const xmlContent = fs.readFileSync(__dirname + '/Command.xml');
parser.parseString(xmlContent, function (err, result) {
  if (err) {
    console.error('parse xml error', err)
    return
  }

  // 获取xml解析为json后的结果
  const appList = result['AppList']['AppServer'];
  console.log('---get app list---');

  // 读取proto文件列表
  const protoDir = './protobuf'
  const files = fs.readdirSync(protoDir)
  const protoFileList = []
  for (let file of files) {
    if (file.indexOf('.proto') <= 0) {
      continue;
    }

    const content = fs.readFileSync(protoDir + '/' + file, 'utf8')
    const start = content.indexOf('package')
    const filename = file.substring(0, file.indexOf('.'))
    if (filename.length <= 0 || start < 0) {
      console.error('file content error', file)
      continue;
    }
    
    const end = content.indexOf(';', start + 1)
    if (end > start) {
      const arr = content.substring(start, end).split(' ')
      if (arr.length > 1) {
        protoFileList.push({ filename: filename, package: arr[1]})
      }
    }
  }
  console.log('---get proto file list---');

  // 删除先前的文件
  const dstFile = __dirname + '/cbusCommand.js';
  fs.unlinkSync(dstFile);
  console.log('---delete old cbusCommand.js---')

  // 写入模板文件
  template = template.replace('%AppList%', JSON.stringify(appList, undefined, 2));
  template = template.replace('%ProtoFileList%', JSON.stringify(protoFileList, undefined, 2))
  const w = fs.createWriteStream(dstFile);
  w.write(template, function(err, data) {
    if (err) {
      console.log(err);
    } else {
      console.log('---write success---');
    }
  })
});

