const restaurantRoutes = require('./restaurants/restaurantRoutes')

module.exports = function(app, db) {
	restaurantRoutes(app, db)
  // Other route groups could go here, in the future
}
