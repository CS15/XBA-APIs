// setup environment
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// modules
var app = require('./config/express')();
var config = require('./config/config');

// listen
app.listen(config.server.port, function (err) {
	if (err) {
		throw err;
	} else {
		console.info('XBA server running at port: ' + config.server.port);
	}
});