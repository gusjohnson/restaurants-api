/* eslint-disable */

const express = require("express")
const bodyParser = require("body-parser")
const mongodb = require("mongodb")

const app = express()
app.use(bodyParser.json())

require('./app/restaurants/restaurantRoutes')(app, {})

// Create a database constiable outside of the database connection callback to reuse the connection pool in your app.
var db;

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/test", function (err, client) {
  if (err) {
    console.log(err)
    process.exit(1)
  }

  // Save database object from the callback for reuse.
  db = client.db()
  console.log("Database connection ready")

  // Initialize the app.
  const server = app.listen(process.env.PORT || 8080, function () {
    const port = server.address().port
    console.log("App now running on port", port)
  })
})
