var fs = require('fs'),
  xml2js = require('xml2js');

var parser = new xml2js.Parser();
fs.readFile(__dirname + '/Command.xml', function(err, data) {
  parser.parseString(data, function (err, result) {
    if (err) {
      console.error(err)
      return
    }

    var content = 'export const AppList=' + JSON.stringify(result['AppList']['AppServer'], undefined, 2)
    var w = fs.createWriteStream(__dirname + '/Command.js')
    w.write(content, function(err, data) {
      if (err) {
        console.error(err)
      } else {
        console.log('write app list success')
        writeFileList()
      }
    })
  });
});

function writeFileList() {
  const protoDir = '../../public/protobuf'
  const files = fs.readdirSync(protoDir)
  const FileList = []
  for (let file of files) {
    if (file.indexOf('.proto') > 0) {
      const content = fs.readFileSync(protoDir + '/' + file, 'utf8')
      const start = content.indexOf('package')
      const filename = file.substring(0, file.indexOf('.'))
      if (filename.length > 0 && start >= 0) {
        const end = content.indexOf(';', start + 1)
        if (end > start) {
          const arr = content.substring(start, end).split(' ')
          if (arr.length > 1) {
            FileList.push({ filename: filename, package: arr[1]})
          }
        }
      }
    }
  }
  
  const fileListStr = '\n\n export const FileList=' + JSON.stringify(FileList, undefined, 2)
  var w = fs.createWriteStream(__dirname + '/Command.js', { flags: 'a+'})
  w.write(fileListStr, function(err, data) {
    if (err) {
      console.error(err)
    } else {
      console.log('write file list success')
    }
  })    
}
