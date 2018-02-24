(function(global, factory) {

/* CommonJS */ if (typeof require === 'function' && typeof module === "object" && module && module["exports"])
  module['exports'] = (function() {
      return factory();
  })();
/* Global */ else
  global["observer"] = factory();
})(this, function() {
  var ob = function() {
    this.subscribers = [];			// 订阅者数组
  }

  ob.prototype = {
    sub : function(evt, fn) {		// 订阅方法，返回订阅event标识符
      this.subscribers[evt] ? this.subscribers[evt].push(fn) : (this.subscribers[evt] = []) && this.subscribers[evt].push(fn);
      return '{"evt":"' + evt + '","fn":"' + (this.subscribers[evt].length - 1) + '"}';
    },

    pub : function(evt, args) {	// 发布方法，成功后返回自身
      if (this.subscribers[evt]) {
        for (var i in this.subscribers[evt]) {
          if (typeof(this.subscribers[evt][i]) === 'function') {
            if (arguments.length === 2) {
              this.subscribers[evt][i](args);
            } else {
              this.subscribers[evt][i](arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6]);
            }
          }
        }
        return this;
      }
      return false;
    },

    unsub : function(subId) {		// 解除订阅，需传入订阅event标识符
      try {
        var id = JSON.parse(subId);
        this.subscribers[id.evt][id.fn] = null;
        delete this.subscribers[id.evt][id.fn];
      } catch (err) {
        console.log(err);
      }
    },

    contains : function(evt) {
      return this.subscribers[evt] ? true : false;
    }
  }

  return new ob();
});
