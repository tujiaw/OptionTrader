

const src = {
  title: '2222',
  data: [1, 2, 3]
}

let data = [...src.data]
data.splice(1, 1)

const dst = {...src, data}
console.log(dst)