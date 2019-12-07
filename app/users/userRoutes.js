'use strict'

const auth = require('../../middleware/auth')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const User = mongoose.model('User')

module.exports = function(app) {
  app.get('/users/current', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password')
    res.send(user)
  })

  app.get('/users', auth, async (req, res) => {
    const user = await User.find({})//.select('-password')
    res.send(user)
  })
  
  app.post('/users', async (req, res) => {
    let user = await User.findOne({ email: req.body.email })
    if (user) return res.status(400).send('User already registered.')
  
    user = new User({
      name: req.body.name,
      password: req.body.password,
      email: req.body.email
    })
    user.password = await bcrypt.hash(user.password, 10)
    await user.save()
  
    const token = user.generateAuthToken()
    res.header('x-auth-token', token).send({
      _id: user._id,
      name: user.name,
      email: user.email
    })
  })

  app.post('/users/login', async function(req, res) {
    User.findOne({ email: req.body.email }, async function (err, user) {
      if (err) return res.status(500).send('Error on the server.')
      if (!user) return res.status(404).send('No user found.')
      
      var passwordIsValid = await bcrypt.compare(req.body.password, user.password)
      if (!passwordIsValid) return res.status(401).send({ auth: false, token: null })
      
      const token = user.generateAuthToken()
      
      res.status(200).send({ auth: true, token: token })
    })
  })
}