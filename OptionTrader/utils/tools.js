// 防抖函数 
export function debounce(fn, delay) {
    // 持久化一个定时器 timer
    let timer = null;
    // 闭包函数可以访问 timer
    return function() {
      // 通过 'this' 和 'arguments' 获得函数的作用域和参数
      let self = this;
      let args = arguments;
      // 如果事件被触发，清除 timer 并重新开始计时
      clearTimeout(timer);
      timer = setTimeout(function() {
        fn.apply(self, args);
      }, delay);
    }
  }
  
  export function DateFormat(date, format) {
    var o = {
      "M+": date.getMonth() + 1,
      // month
      "d+": date.getDate(),
      // day
      "h+": date.getHours(),
      // hour
      "m+": date.getMinutes(),
      // minute
      "s+": date.getSeconds(),
      // second
      "q+": Math.floor((date.getMonth() + 3) / 3),
      // quarter
      "S": date.getMilliseconds()
      // millisecond
    };
    if (/(y+)/.test(format) || /(Y+)/.test(format)) {
      format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
      if (new RegExp("(" + k + ")").test(format)) {
        format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
      }
    }
    return format;
  }
  
  export function timestampformat(timestamp) {
    var date = new Date(timestamp * 1000)
    return DateFormat(date, "yyyy-MM-dd hh:mm:ss");
  }
  
  export function GetCurrentTime() {
    var curTime = new Date();
    return DateFormat(curTime, 'yyyy-MM-dd h:m:s');
  }

  export function isArray(obj) {
    return Object.prototype.toString.call(obj)=='[object Array]'
  }