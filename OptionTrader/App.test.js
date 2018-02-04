var _ = require('lodash')

_.forEach({ 'a': 1, 'b': 2 }, function(n, key) {
  console.log(n, key);
  if (n === 1) {
    return false
  }
});