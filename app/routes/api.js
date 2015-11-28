var request = require('request');
var cheerio = require('cheerio');
var cors = require('cors');
var config = require('../../config/config');
var Parse = require('parse/node').Parse;

module.exports = function (app, express) {
    // router
    var api = express.Router();
    var baseUrl = "http://www.xboxachievements.com";

    // prefix api route
    app.use('/api', api);
    app.use(cors());

    api.get('/gb', function (req, res) {
        var url = 'http://www.giantbomb.com/api/game/3030-' + req.query.gameId + '/?format=json&api_key=60a1d643b4a4ad1ad1b424a040cbf3e8b5393e41';

        request(url, function (error, response, html) {
            return res.status(200).send(response.body);
        });
    });
};