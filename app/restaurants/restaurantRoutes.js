'use strict'

const controller = require('./restaurantController.js')

module.exports = function(app) {
  app.get('/', (req, res) => res.send('jgj-restaurants-api'))

  app.get('/restaurants', async function(req, res) {
    await controller.list(req, res)
  })

  app.post('/restaurants', async function(req, res) {
    await controller.save(req, res)
  })

  app.get('/restaurants/:id', async function(req, res) {
    await controller.show(req, res)
  })

  app.put('/restaurants/:id', async function(req, res) {
    await controller.update(req, res)
  })

  app.delete('/restaurants/:id', async function(req, res) {
    await controller.remove(req, res)
  })
}
