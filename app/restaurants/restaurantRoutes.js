'use strict'
const mongoose = require('mongoose')
const Restaurant = mongoose.model('Restaurant')

module.exports = function(app) {
  app.get('/', (req, res) => res.send('jgj-restaurants-api'))

  /*  "/api/restaurants"
  *    GET: finds all restaurants
  *    POST: creates a new restaurant
  */

  app.get('/restaurants', async function(req, res) {
    try {
      const restaurants = await Restaurant.find(req.query)
      res.status(200).json(restaurants)
    } catch (e) {
      console.error('Error occurred fetching restaurants', e)
      res.status(500).json(response(500, 'Internal server error'))
    }
  })

  app.post('/restaurants', async function(req, res) {
    try {
      const newRestaurantReq = req.body
      newRestaurantReq.creationDate = new Date()
      const restaurant = new Restaurant(newRestaurantReq)
      await restaurant.save()
      res.status(201).json(restaurant)
    } catch (e) {
      console.error('Error occurred creating restaurant', e)
      res.status(500).json(response(500, 'Internal server error'))
    }
  })

  /*  "/api/restaurants/:id"
  *    GET: find restaurant by id
  *    PUT: update restaurant by id
  *    DELETE: deletes restaurant by id
  */

  app.get('/restaurants/:id', async function(req, res) {
    try {
      const restaurant = await Restaurant.findOne({'_id': req.params.id})
      if (restaurant) {
        res.status(200).json(restaurant)
      } else {
        res.status(404).json(response(404, `Restaurant ${req.params.id} not found`))
      }
    } catch (e) {
      console.error(`Error occurred getting restaurant ${req.params.id}`, e)
      res.status(500).json(response(500, 'Internal server error'))
    }
  })

  app.put('/restaurants/:id', async function(req, res) {
    try {
      const restaurant = await Restaurant.findOne({'_id': req.params.id})
      if (restaurant) {
        restaurant.name = req.body.name
        restaurant.address = req.body.address
        restaurant.googleRating = req.body.googleRating
        restaurant.userRating = req.body.userRating
        restaurant.lane = req.body.lane
        await restaurant.save()
        res.status(200).json(restaurant)
      } else {
        res.status(404).json(response(404, `Restaurant ${req.params.id} not found`))
      }
    } catch (e) {
      console.error(`Error occurred getting restaurant ${req.params.id}`, e)
      res.status(500).json(response(500, 'Internal server error'))
    }
  })

  app.delete('/restaurants/:id', async function(req, res) {
    await Restaurant.deleteOne({'_id': req.params.id})
    res.status(204).json()
  })
}

function response(code, message) {
  return {
    statusCode: code,
    message: message
  }
}
