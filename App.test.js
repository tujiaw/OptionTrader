var _ = require('lodash')

const x = [1, 2, 3, 4, 5]

const y = _.filter(x, item => item !== 3)
console.log(x === y)

console.log(x)