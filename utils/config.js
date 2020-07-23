if (process.env.NODE_ENV !== 'production') {
    console.log('non production env')
    require('dotenv').config()
}

let PORT = process.env.PORT
let MONGODB_URI = process.env.MONGODB_URI

module.exports = {
  MONGODB_URI,
  PORT
}