'use strict'
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const User = mongoose.model('User')

async function list(req, res) {
  try {
    const user = await User.find({})//.select('-password')
    res.send(user)
  } catch (e) {
    console.error('Error occurred fetching users', e)
    res.status(500).json(response(500, 'Internal server error'))
  }
}

async function save(req, res) {
  try {
    let user = await User.findOne({ email: req.body.email })
    if (user) return res.status(400).send('User already registered.')
  
    user = new User({
      name: req.body.name,
      password: req.body.password,
      email: req.body.email,
      isAdmin: req.body.isAdmin
    })
    user.password = await bcrypt.hash(user.password, 10)
    await user.save()
  
    const token = user.generateAuthToken()
    res.header('x-auth-token', token).send({
      _id: user._id,
      name: user.name,
      email: user.email
    })
  } catch (e) {
    console.error('Error occurred creating user', e)
    res.status(500).json(response(500, 'Internal server error'))
  }
}

async function login(req, res) {
  try {
    User.findOne({ email: req.body.email }, async function (err, user) {
      if (err) return res.status(500).json(response(500, 'Internal server error'))
      if (!user) return res.status(404).json(response(404, `User ${req.params.id} not found`))
      
      const passwordIsValid = await bcrypt.compare(req.body.password, user.password)
      if (!passwordIsValid) return res.status(401).send({ auth: false, token: null })
      
      const token = user.generateAuthToken()
      
      res.status(200).send({ auth: true, token: token })
    })
  } catch (e) {
    console.error('Error occurred logging in', e)
    res.status(500).json(response(500, 'Internal server error'))
  }
}

async function remove(req, res) {
  // need to invalidate token
  await User.deleteOne({'_id': req.params.id})
    res.status(204).json()
}

function response(code, message) {
  return {
    statusCode: code,
    message: message
  }
}

module.exports = {
  list,
  save,
  login,
  remove
}
