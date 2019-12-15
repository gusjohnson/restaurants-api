'use strict'
const auth = require('../../middleware/auth')
const controller = require('./restaurantController.js')

module.exports = function(app) {
  app.get('/', (req, res) => res.send('jgj-restaurants-api'))

  app.get('/restaurants', auth, async function(req, res) {
    await controller.list(req, res)
  })

  app.post('/restaurants', auth, async function(req, res) {
    await controller.save(req, res)
  })

  app.get('/restaurants/:id', auth, async function(req, res) {
    await controller.show(req, res)
  })

  app.put('/restaurants/:id', auth, async function(req, res) {
    await controller.update(req, res)
  })

  app.delete('/restaurants/:id', auth, async function(req, res) {
    await controller.remove(req, res)
  })
}
