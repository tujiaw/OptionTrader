var _ = require('lodash')

const x = [{a: 1, b: 2}, {a: 11, b: 22}]
let f = _.find(x, item => item.a === 1);
f.b = 2222222
console.log(x)