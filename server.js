const express = require("express")
const bodyParser = require("body-parser")
const mongodb = require("mongodb")
const ObjectID = mongodb.ObjectID

const RESTAURANTS_COLLECTION = "restaurants"

const app = express()
app.use(bodyParser.json())

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

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

/*  "/api/restaurants"
 *    GET: finds all restaurants
 *    POST: creates a new restaurant
 */

app.get("/api/restaurants", function(req, res) {
  db.collection(RESTAURANTS_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get restaurants.")
    } else {
      res.status(200).json(docs)
    }
  })
})

app.post("/api/restaurants", function(req, res) {
  var newRestaurant = req.body
  newRestaurant.createDate = new Date()

  if (!req.body.name) {
    handleError(res, "Invalid user input", "Must provide a name.", 400)
  } else {
    db.collection(RESTAURANTS_COLLECTION).insertOne(newRestaurant, function(err, doc) {
      if (err) {
        handleError(res, err.message, "Failed to create new restaurant.")
      } else {
        res.status(201).json(doc.ops[0])
      }
    })
  }
})

/*  "/api/restaurants/:id"
 *    GET: find restaurant by id
 *    PUT: update restaurant by id
 *    DELETE: deletes restaurant by id
 */

app.get("/api/restaurants/:id", function(req, res) {
})

app.put("/api/restaurants/:id", function(req, res) {
})

app.delete("/api/restaurants/:id", function(req, res) {
})
