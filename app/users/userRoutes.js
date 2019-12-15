'use strict'
const auth = require('../../middleware/auth')
const mongoose = require('mongoose')
const User = mongoose.model('User')
const controller = require('./userController.js')

module.exports = function(app) {
  app.get('/users/current', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password')
    res.send(user)
  })

  app.get('/users', auth, async (req, res) => {
    await controller.list(req, res)
  })
  
  app.post('/users', async (req, res) => {
    await controller.save(req, res)
  })

  app.post('/users/login', async function(req, res) {
    await controller.login(req, res)
  })

  app.delete('/users/:id', async function(req, res) {
    await controller.remove(req, res)
  })
}
