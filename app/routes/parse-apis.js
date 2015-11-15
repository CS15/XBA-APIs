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

        var obj = Parse.Object.extend("Games");
        var query = new Parse.Query(obj);

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

        var obj = Parse.Object.extend("Games");
        var query = new Parse.Query(obj);

        query.equalTo("gameId", req.body.gameId);
        query.find({
            success: function (results) {
                if (results.length > 0) return res.status(200).send({});

                var ParseGame = Parse.Object.extend("Games");
                var parseGame = new ParseGame();

                parseGame.save(req.body, {
                  success: function(results) {
                    return res.status(200).send(results);
                  },
                  error: function(response, error) {
                    return res.status(404).send(error);
                  }
                });
            },
            error: function (error) {
                return res.status(404).send(error);
            }
        });
    });

    api.post('/game/achievements', function (req, res) {

        var data = req.body;

        var game = Parse.Object.extend("Games");
        var query = new Parse.Query(game);

        query.get(data[0].game, {
            success: function(game) {
                var achievements = [];

                var Achievement = Parse.Object.extend("Achievements");

                for (var i = 0; i < data.length; i++){
                    var ach = new Achievement();
                    ach.set('achievementId', data[i].achievementId);
                    ach.set('title', data[i].title);
                    ach.set('description', data[i].description);
                    ach.set('game', game);
                    ach.set('gamerScore', data[i].gamerScore);
                    ach.set('imageUrl', data[i].imageUrl);
                    ach.set('permalink', data[i].permalink);

                    achievements.push(ach);
                }

                Parse.Object.saveAll(achievements, {
                    success: function(objs) {
                        return res.status(200).send();
                    },
                    error: function(error) {
                        console.log(error);
                        return res.status(error.code).send(error.message);
                    }
                });
            },
            error: function(object, error) {
                return res.status(error.code).send(error.message);
            }
        });
    });
};