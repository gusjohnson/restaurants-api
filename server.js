/* eslint-disable */

const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const cors = require('cors')

const app = express()
app.use(bodyParser.json())
app.use(cors())

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  console.log("Database connection ready")

  // Initialize the app.
  require('./app/restaurants/Restaurant')
  require('./app/restaurants/restaurantRoutes')(app)
  const server = app.listen(process.env.PORT || 8080, function () {
    const port = server.address().port
    console.log("App now running on port", port)
  })
})
