'use strict'

const RESTAURANTS_COLLECTION = 'restaurants'
const ObjectID = mongodb.ObjectID

module.exports = function(app, db) {
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
    db.collection(RESTAURANTS_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, function(err, doc) {
      if (err) {
        handleError(res, err.message, "Failed to get restaurant")
      } else {
        res.status(200).json(doc)
      }
    })
  })

  app.put("/api/restaurants/:id", function(req, res) {
    const updateDoc = req.body
    delete updateDoc._id

    db.collection(RESTAURANTS_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
      if (err) {
        handleError(res, err.message, "Failed to update restaurant")
      } else {
        updateDoc._id = req.params.id
        res.status(200).json(updateDoc)
      }
    })
  })

  app.delete("/api/restaurants/:id", function(req, res) {
    db.collection(RESTAURANTS_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
      if (err) {
        handleError(res, err.message, "Failed to delete contact")
      } else {
        res.status(200).json(req.params.id)
      }
    })
  })
}