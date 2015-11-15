var request = require('request');
var cheerio = require('cheerio');
var Parse = require('parse/node').Parse;
var Game = require("../../app/models/Game");
var Achievement = require("../../app/models/Achievement");

module.exports = function (app, express) {
    // router
    var api = express.Router();
    var baseUrl = "http://www.xboxachievements.com";

    // prefix api route
    app.use('/api/xbox', api);
    
    api.get('/game/achievements', function(req, res){
        
        /**
         * GameId = 3653
         * Permalink = gears-of-war-ultimate-edition
         * Achievement total = 56
         * Gamerscore = 1250
         */
        
        var self = this;

        self.permalink = req.query.permalink;
        self.url = baseUrl + '/game/' + self.permalink + '/achievements/';

        request(self.url, function(error, response, html){
            if (error) return res.status(404).send(error);

            var $ = cheerio.load(html);
            var data = [];

            var root = $('div.bl_la_main div.divtext table tr');
            var descCounter = $(root).find("td.ac1 a.link_ach").length;
            var counter = 0;

            for (var i = 0; i < $(root).find('td.ac2').length; i++){
                var title = $(root).find('td.ac2').eq(i).text().trim();
                var gs = $(root).find("td.ac4 strong").eq(i).text().trim();
                var slug = $(root).find('td.ac1 a').eq(i).attr('href').replace('/game/' + self.permalink, '').replace('/achievement/', '').replace('.html', '');
                var imageUrl = '';
                var desc = '';

                if (i < descCounter) {
                    imageUrl = $(root).find("td.ac1 a img").eq(i).attr("src").replace('lo', 'hi');
                    desc = $(root).find("td.ac3").eq(counter).text();
                } else if (title.equals("Secret Achievement")) {
                    imageUrl = $(root).find("td.ac1 img").eq(i).attr("src").replace('lo', 'hi');
                    desc = "Continue playing to unlock this secret achievement.";
                }

                var achievement = new Achievement();
                achievement.title = title;
                achievement.gamerScore = gs;
                achievement.description = desc;
                achievement.imageUrl = baseUrl + imageUrl;
                achievement.permalink = self.permalink;
                achievement.setAchievementId(slug);

                counter += 2;

                data.push(achievement);
            }

            return res.status(200).send(data);
        });
    });
    
    api.get('/game/info', function(req, res) {
        
        /**
         * GameId = 3653
         * Permalink = gears-of-war-ultimate-edition
         * Achievement total = 56
         * Gamerscore = 1250
         */

        var self = this;

        self.permalink = req.query.permalink;
        self.url = baseUrl + '/game/' + self.permalink + '/achievements/';
        
        request(self.url, function(error, response, html) {
            if (error) return res.status(404).send(error);

            var $ = cheerio.load(html);
            
            var root = $('.blr_main .divtext .men_h_content table tr').eq(0);
            
            var game = new Game();
            game.title = $('.tt').first().text();
            game.imageUrl = baseUrl + $(root).find('td img').eq(0).attr('src');
            game.developer = $(root).find('td').eq(1).find('a[title]').eq(0).text();
            game.publisher = $(root).find('td').eq(1).find('a[title]').eq(1).text();
            game.genre = $(root).find('td').eq(1).find('div').eq(3).text().replace(/\s/g, '').split('/');
            game.release = [
                { usa: $(root).find('td').eq(1).find('div').eq(4).contents().eq(3).text().trim() || null },
                { europe: $(root).find('td').eq(1).find('div').eq(4).contents().eq(6).text().trim() || null},
                { japan: $(root).find('td').eq(1).find('div').eq(4).contents().eq(9).text().trim() || null },
            ];
            game.permalink = self.permalink;
            game.setGameId(baseUrl, game.imageUrl);
            
            return res.status(200).send(game);
            
            /**
             * Post to Parse
             */
             
            // var ParseGame = Parse.Object.extend("Games");
            // var parseGame = new ParseGame();
            
            // parseGame.save(game.toJSON(), {
            //   success: function(response) {
            //     return res.status(200).send(response);
            //   },
            //   error: function(response, error) {
            //     return res.status(404).send(response);
            //   }
            // });
            
            /**
             * Get from Parse
             */
             
            // var GameScore = Parse.Object.extend("Games");
            // var query = new Parse.Query(GameScore);
            
            // query.find({
            //     success: function(results) {
            //         for (var i = 0; i < results.length; i++) {
            //           var object = results[i];
            //         }
                
            //         return res.status(200).send(results);
            //     },
            //     error: function(error) {
            //         return res.status(404).send(error);
            //     }
            // });
        });
    });
};