'use strict'
const mongoose = require('mongoose')
const Restaurant = mongoose.model('Restaurant')

async function list(req, res) {
  try {
    if (!req.user.isAdmin) {
      req.query.userId = req.user._id
    }
    const restaurants = await Restaurant.find(req.query)
    res.status(200).json(restaurants)
  } catch (e) {
    console.error('Error occurred fetching restaurants', e)
    res.status(500).json(response(500, 'Internal server error'))
  }
}

async function show(req, res) {
  try {
    const restaurantQuery = {
      '_id': req.params.id
    }

    if (!req.user.isAdmin) {
      restaurantQuery.userId = req.user._id
    }

    const restaurant = await Restaurant.findOne(restaurantQuery)
    if (restaurant) {
      res.status(200).json(restaurant)
    } else {
      res.status(404).json(response(404, `Restaurant ${req.params.id} not found`))
    }
  } catch (e) {
    console.error(`Error occurred getting restaurant ${req.params.id}`, e)
    res.status(500).json(response(500, 'Internal server error'))
  }
}

async function save(req, res) {
  try {
    const newRestaurantReq = req.body
    newRestaurantReq.creationDate = new Date()
    newRestaurantReq.userId = req.user._id
    const restaurant = new Restaurant(newRestaurantReq)
    await restaurant.save()
    res.status(201).json(restaurant)
  } catch (e) {
    console.error('Error occurred creating restaurant', e)
    res.status(500).json(response(500, 'Internal server error'))
  }
}

async function update(req, res) {
  try {
    const restaurantQuery = {
      '_id': req.params.id
    }

    if (!req.user.isAdmin) {
      restaurantQuery.userId = req.user._id
    }

    const restaurant = await Restaurant.findOne(restaurantQuery)
    if (restaurant) {
      restaurant.name = req.body.name
      restaurant.address = req.body.address
      restaurant.googleRating = req.body.googleRating
      restaurant.userRating = req.body.userRating
      restaurant.lane = req.body.lane
      restaurant.displayOrder = req.body.displayOrder
      await restaurant.save()
      res.status(200).json(restaurant)
    } else {
      res.status(404).json(response(404, `Restaurant ${req.params.id} not found`))
    }
  } catch (e) {
    console.error(`Error occurred getting restaurant ${req.params.id}`, e)
    res.status(500).json(response(500, 'Internal server error'))
  }
}

async function remove(req, res) {
  try {
    const restaurantQuery = {
      '_id': req.params.id
    }

    if (!req.user.isAdmin) {
      restaurantQuery.userId = req.user._id
    }
    
    const restaurant = await Restaurant.findOne(restaurantQuery)
      if (restaurant) {
        await Restaurant.deleteOne(restaurantQuery)
        res.status(204).json()
      } else {
        res.status(404).json(response(404, `Restaurant ${req.params.id} not found`))
      }
  } catch (e) {
    console.error(`Error occurred deleting restaurant ${req.params.id}`, e)
    res.status(500).json(response(500, 'Internal server error'))
  }
}

function response(code, message) {
  return {
    statusCode: code,
    message: message
  }
}

module.exports = {
  list,
  show,
  save,
  update,
  remove
}
