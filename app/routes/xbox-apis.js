var request = require('request');
var cheerio = require('cheerio');
var Parse = require('parse/node').Parse;
var Game = require("../../app/models/Game");
var GameBrowse = require("../../app/models/GameBrowse");
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
            game.releases = [
                { region: 'usa', date: $(root).find('td').eq(1).find('div').eq(4).contents().eq(3).text().trim() || null },
                { region: 'europe', date: $(root).find('td').eq(1).find('div').eq(4).contents().eq(6).text().trim() || null},
                { region: 'japan', date: $(root).find('td').eq(1).find('div').eq(4).contents().eq(9).text().trim() || null }
            ];
            game.permalink = self.permalink;
            game.setGameId(baseUrl, game.imageUrl);
            
            return res.status(200).send(game);

        });
    });

    api.get('/games', function(req, res) {

        var self = this;

        if (!req.query.page)
            req.query.page = 1;

        if (!req.query.letter)
            req.query.letter = 'a';

        if (req.query.letter === '0-9')
            req.query.letter = '-';

        self.data = {};
        self.url = baseUrl + '/browsegames/' + req.query.console + '/' + req.query.letter + '/' + req.query.page;

        request(self.url, function(error, response, html) {
            if (error) return res.status(404).send(error);

            var $ = cheerio.load(html);

            var root = $('.bl_la_main .divtext table');

            var rows = $(root).eq(0).find('tr[class]');

            self.data = [];

            for (var i = 0; i < $(rows).length; i++) {

                var game = new GameBrowse();
                game.title = $(rows).eq(i).find("strong").text().trim();
                game.imageUrl = baseUrl + $(rows).eq(i).find("td a img").attr("src").replace('ico', 'cover').trim();
                game.icoUrl = baseUrl + $(rows).eq(i).find("td a img").attr("src").trim();
                game.numberOfAchievements = $(rows).eq(i).find("td[align]").eq(0).text().trim();
                game.gamerScore = $(rows).eq(i).find("td[align]").eq(1).text().trim();
                game.permalink = $(rows).eq(i).find("a").eq(0).attr('href').trim().replace('/game/', '').replace('/achievements/', '');
                game.setGameId(baseUrl, game.imageUrl);

                self.data.push(game);
            }

            return res.status(200).send(self.data);
        });
    });

    api.get('/latest/achievements', function(req, res){

        var self = this;

        if (!req.query.page)
            req.query.page = 1;

        self.data = [];
        self.url = baseUrl + '/archive/achievements/' + req.query.page + '/';

        var counter = 1;

        request(self.url, function(error, response, html){
            if (error) return res.status(404).send(error);

            var counter = 0;

            var $ = cheerio.load(html);

            var root = $('div.bl_la_main div.divtext table tr');

            for (var i = 0; i < $(root).find('.newsTitle').length; i++){

                var title = $(root).find('.newsTitle a').eq(i).text().replace('Game Added:', '').replace('DLC Added:', '').trim();
                var imageUrl = $(root).find('td[width=70] img').eq(i).attr('src');
                var link = $(root).find("td[width=442] a").eq(counter).attr('href');
                var content = $(root).find("td[width=442]").eq(i);

                if ($(content).find('p').length > 0) {
                    content = $(content).find('p').text().trim().replace('\r\n\t', ' ') + '.';
                }
                else {
                    content = $(content).text().trim().substr(0, $(content).text().indexOf('View')) + '.';
                }

                var contents = content.split('.');

                var commentsPermalink = $(root).find('td[width=442] div[align=right] a').eq(i).attr('href');

                var ach = {
                    title: title,
                    imageUrl: baseUrl + imageUrl,
                    link: baseUrl + link,
                    achievementsAdded: contents[0].substr(0, contents[0].indexOf(',')).trim(),
                    gamerScoreAdded: contents[0].substr(contents[0].indexOf(',') + 1).trim(),
                    submittedBy: contents[1].trim(),
                    gamePermalink: link.replace('/game/', '').replace('/achievements/', ''),
                    commentsPermalink: commentsPermalink
                };

                self.data.push(ach);

                counter += 2;
            }

            if (self.data.length === 0)
                return res.status(404).send({ status: 404, message: 'Not Found.'});

            return res.status(200).send(self.data);
        });
    });
};