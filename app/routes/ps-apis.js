var request = require('request');
var cheerio = require('cheerio');
var config = require('../../config/config');

module.exports = function (app, express) {
    // router
    var api = express.Router();
    var baseUrl = "http://www.playstationtrophies.org/";

    // prefix api route
    app.use('/api', api);
}