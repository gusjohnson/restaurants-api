/* eslint-disable no-undef */

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
const config = require('config')

const app = express()
app.use(bodyParser.json())
app.use(cors())

if (!config.get('myprivatekey')) {
  console.error('FATAL ERROR: myprivatekey is not defined.')
  process.exit(1)
}

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  console.log('Database connection ready')

  // Initialize the app.
  require('./app/restaurants/Restaurant')
  require('./app/restaurants/restaurantRoutes')(app)
  require('./app/users/User')
  require('./app/users/userRoutes')(app)
  const server = app.listen(process.env.PORT || 8100, function () {
    const port = server.address().port
    console.log('App now running on port', port)
  })
})
