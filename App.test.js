var _ = require('lodash')

var users = [
    { 'user': 'barney',  'age': 36, 'active': true },
    { 'user': 'fred',    'age': 40, 'active': false },
    { 'user': 'pebbles', 'age': 1,  'active': true }
  ];

  const s = _.find(users, item => item.age === 36 && item.active === false)
  if (s) {
      Object.assign(s, {'active': false})
  } else {
      users.push({'user': 'hello'})
  }
  console.log(users)