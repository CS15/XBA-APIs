// modules
var path = require('path');

/**
 * @description : application routes
 *
 * @param app : express application instance
 */
module.exports = function(app) {

	/**
	 * @description : home route.
	 */
	app.get('/', function(req, res) {
		res.sendFile(path.resolve('./public/views/index.html'));
	});

	/**
	 * @description : catch all routes.
	 */
	app.get('/*', function(req, res) {
		res.sendFile(path.resolve('./public/views/index.html'));
	});
};