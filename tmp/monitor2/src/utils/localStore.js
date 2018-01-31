export default {
  getItem: (key) => {
    let value
    try {
      value = localStorage.getItem(key)
    } catch (e) {
        console.error('localStorage.getItem failed, ', e.message)
    } finally {
      return value
    }
  },
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value)
    } catch (e) {
        console.error('localStorage.setItem failed, ', e.message)
    }
  }
}

