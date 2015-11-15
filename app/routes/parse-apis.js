var Parse = require('parse/node').Parse;
var Game = require("../../app/models/Game");
var GameBrowse = require("../../app/models/GameBrowse");
var Achievement = require("../../app/models/Achievement");

module.exports = function (app, express) {
    // router
    var api = express.Router();
    var baseUrl = "http://www.xboxachievements.com";

    // prefix api route
    app.use('/api/parse', api);

    api.get('/game/info', function (req, res) {

        var GameScore = Parse.Object.extend("Games");
        var query = new Parse.Query(GameScore);

        query.equalTo("gameId", req.query.gameId);
        query.find({
            success: function (results) {
                return res.status(200).send(results);
            },
            error: function (error) {
                return res.status(404).send(error);
            }
        });
    });

    api.post('/game/info', function (req, res) {

        //console.log(req.body);

        var ParseGame = Parse.Object.extend("Games");
        var parseGame = new ParseGame();

        parseGame.save(req.body, {
          success: function(response) {
            return res.status(200).send(response);
          },
          error: function(response, error) {
            return res.status(404).send(response);
          }
        });
    });
};