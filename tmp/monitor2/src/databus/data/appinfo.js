export const appinfo = (function() {
  const data = {}
  return {
    isExist: function(addrstr) {
      return addrstr && addrstr.length && data[addrstr]
    },
    set: function(addrstr, value) {
      if (addrstr && addrstr.length) {
        data[addrstr] = value
      }
    }
  }
}())