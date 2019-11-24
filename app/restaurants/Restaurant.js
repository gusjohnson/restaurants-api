'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const restaurantSchema = new Schema({
  name:  String,
  address: String,
  googleRating:   Number,
  userRating: Number,
  lane: String,
  creationDate: Date,
  createdBy: String
})

mongoose.model('Restaurant', restaurantSchema)
