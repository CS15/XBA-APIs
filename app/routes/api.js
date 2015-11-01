var request = require('request');
var cheerio = require('cheerio');
var config = require('../../config/config');

module.exports = function (app, express) {
    // router
    var api = express.Router();
    var baseUrl = "http://www.xboxachievements.com";

    // prefix api route
    app.use('/api', api);

    api.get('/latest/news', function (req, res) {

        if (!config.checkApiKey(req.query.key))
            return res.status(403).send({ status: 403, message: 'Forbidden: Wrong or No API Key provided.'});

        if (!req.query.page)
            req.query.page = 1;
            
        var url = baseUrl + '/archive/gaming-news/' + req.query.page + '/';
        var self = this;
        
        self.data = [];

        request(url, function (error, response, html) {
            if (error) res.status(404).send(error);

            var $ = cheerio.load(html);

            var root = $('div.bl_la_main div.divtext table[width=638] tr');

            root.each(function (index, value) {
                if (index % 2 == 0) {

                    var news = {
                        title: $(value).find('.newsTitle a').text(),
                        subtitle: $(value).find('.newsNFO').next().text(),
                        imageUrl: baseUrl + $(value).find('img').attr('src'),
                        author: $(value).find('.newsNFO').text(),
                        newsPermalink: $(value).find('a').attr('href').replace('/news/', '').replace('.html', '')
                    };

                    self.data.push(news);
                }
            });
            
            if (self.data.length === 0)
                return res.status(404).send({ status: 404, message: 'Not Found.'});
                
            return res.status(200).send(self.data);
        });
    });

    api.get('/news', function (req, res) {
        
        if (!config.checkApiKey(req.query.key))
            return res.status(403).send({ status: 403, message: 'Forbidden: Wrong or No API Key provided.'});
            
        var self = this;

        self.data = {};
        self.permalink = req.query.permalink;
        self.url = baseUrl + '/news/' + self.permalink + '.html';

        self.nID = self.permalink.substr(self.permalink.indexOf('-') + 1);
        self.nID = self.nID.substr(0, self.nID.indexOf('-'));

        request(self.url, function (error, response, html) {

            if (error) return res.status(404).send(error);

            var $ = cheerio.load(html);

            var root = $('div.articleText');

            self.data.nID = self.nID;
            self.data.authorAvatar = baseUrl + $(root).find('table td[width=65] img').attr('src');
            self.data.authorName = $(root).find('table td div.newsNFO span[itemprop=name]').text();
            self.data.authorFirstName = self.data.authorName.substr(0, self.data.authorName.indexOf(' '));
            self.data.authorLastName = self.data.authorName.substr(self.data.authorName.indexOf(' ') + 1);
            self.data.datePublished = $(root).find('table td div.newsNFO span[itemprop=datePublished]').text();
            self.data.title = $(root).find('table td h1.newsTitle').text();
            self.data.content = [];
            self.data.images = [];
            self.data.videos = [];

            $(root).find('[itemprop=articleBody] p').each(function(index, value){
                if ($(value).text().trim() != '') {
                    self.data.content.push($(value).text().trim());
                }
            });

            $(root).find('[itemprop=articleBody] img').each(function (i, value) {
                var imageUrl = baseUrl + value.attribs.src.replace(baseUrl, '');
                
                self.data.images.push(imageUrl);
            });

            $(root).find('[itemprop=articleBody] iframe').each(function (i, value) {
                self.data.videos.push(value.attribs.src);
            });

            
            if (self.data === {})
                return res.status(404).send({ status: 404, message: 'Not Found.'});

            return res.status(200).send(self.data);

        });
    });

    api.get('/latest/achievements', function(req, res){

        if (!config.checkApiKey(req.query.key))
            return res.status(403).send({ status: 403, message: 'Forbidden: Wrong or No API Key provided.'});

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

    api.get('/game/achievements', function(req, res){
        
        if (!config.checkApiKey(req.query.key))
            return res.status(403).send({ status: 403, message: 'Forbidden: Wrong or No API Key provided.'});

        var self = this;

        self.data = [];
        self.permalink = req.query.game;
        self.url = baseUrl + '/game/' + self.permalink + '/achievements/';

        request(self.url, function(error, response, html){
            if (error) return res.status(404).send(error);

            var $ = cheerio.load(html);

            var root = $('div.bl_la_main div.divtext table tr');
            var descCounter = $(root).find("td.ac1 a.link_ach").length;
            var counter = 0;

            for (var i = 0; i < $(root).find('td.ac2').length; i++){
                var title = $(root).find('td.ac2').eq(i).text().trim();
                var gs = $(root).find("td.ac4 strong").eq(i).text().trim();
                var permalink = $(root).find('td.ac1 a').eq(i).attr('href').replace('/game/' + self.permalink, '').replace('/achievement/', '').replace('.html', '');
                var imageUrl = '';
                var desc = '';

                if (i < descCounter) {
                    imageUrl = $(root).find("td.ac1 a img").eq(i).attr("src").replace('lo', 'hi');
                    desc = $(root).find("td.ac3").eq(counter).text();
                } else if (title.equals("Secret Achievement")) {
                    imageUrl = $(root).find("td.ac1 img").eq(i).attr("src").replace('lo', 'hi');
                    desc = "Continue playing to unlock this secret achievement.";
                }

                var achievement = {
                    title: title,
                    gamerScore: gs,
                    description: desc,
                    imageUrl: baseUrl + imageUrl,
                    gamePermalink: self.permalink,
                    achievementPermalink: permalink
                };

                counter += 2;

                self.data.push(achievement);
            }

            if (self.data.length === 0)
                return res.status(404).send({ status: 404, message: 'Not Found.'});
                
            return res.status(200).send(self.data);
        });
    });

    api.get('/game/screenshots', function (req, res){
        
        if (!config.checkApiKey(req.query.key))
            return res.status(403).send({ status: 403, message: 'Forbidden: Wrong or No API Key provided.'});
        
        var self = this;

        if (!req.query.page)
            req.query.page = 1;
            
        self.data = {};    
        self.data.images = [];
        self.data.gamePermalink = self.permalink;
        self.permalink = req.query.game;
        self.url = baseUrl + '/game/' + self.permalink + '/screenshots/' + req.query.page + '/' + req.params.page + '/';

        request(self.url, function(error, response, html) {
            if (error) return res.status(404).send(error);

            var $ = cheerio.load(html);

            var root = $('div.bl_la_main div.divtext table tr img');

            $(root).each(function (index, value){
                var image = baseUrl + $(value).attr('src').replace('thu', 'med');

                self.data.images.push(image);
            });

            if (self.data.images.length === 0)
                return res.status(404).send({ status: 404, message: 'Not Found.'});
            
            return res.status(200).send(self.data);
        });
    });
    
    api.get('/game/info', function(req, res) {
        
        if (!config.checkApiKey(req.query.key))
            return res.status(403).send({ status: 403, message: 'Forbidden: Wrong or No API Key provided.'});
        
        var self = this;

        self.data = {};
        self.permalink = req.query.game;
        self.url = baseUrl + '/game/' + self.permalink + '/achievements/';
        
        request(self.url, function(error, response, html) {
            if (error) return res.status(404).send(error);

            var $ = cheerio.load(html);
            
            var root = $('.blr_main .divtext .men_h_content table tr').eq(0);
            
            self.data.title = $('.tt').first().text();
            self.data.coverUrl = baseUrl + $(root).find('td img').eq(0).attr('src');
            self.data.developer = $(root).find('td').eq(1).find('a[title]').eq(0).text();
            self.data.publisher = $(root).find('td').eq(1).find('a[title]').eq(1).text();
            self.data.genre = $(root).find('td').eq(1).find('div').eq(3).text();
            self.data.release = [
                { usa: $(root).find('td').eq(1).find('div').eq(4).contents().eq(3).text().trim() || null },
                { europe: $(root).find('td').eq(1).find('div').eq(4).contents().eq(6).text().trim() || null},
                { japan: $(root).find('td').eq(1).find('div').eq(4).contents().eq(9).text().trim() || null },
            ];
            self.data.gamePermalink = self.permalink;
            
            if (self.data === {})
                return res.status(404).send({ status: 404, message: 'Not Found.'});
            
            res.status(200).send(self.data);
        });
    });
    
    api.get('/game/achievement/comments', function(req, res) {
        
        if (!config.checkApiKey(req.query.key))
            return res.status(403).send({ status: 403, message: 'Forbidden: Wrong or No API Key provided.'});
        
        var self = this;

        self.data = [];
        self.url = baseUrl + '/game/' + req.query.game + '/achievement/' + req.query.achievement + '.html';

        request(self.url, function(error, response, html) {
            if (error) return res.status(404).send(error);

            var $ = cheerio.load(html);

            var comments = $('.bl_la_main .divtext table.ac tr');

            $(comments).each(function(i, value){
                var author = $(value).find('td.ac a').eq(2).text().trim();
                var createdAt = $(value).find('td div.newsNFO').text().trim();
                var content = [];
                
                var commentContent = $(value).find('td.ac').contents();
                
                for (var i = 5; i < $(commentContent).length; i++) {
                    if ($(commentContent).eq(i).text().trim())
                        content.push($(commentContent).eq(i).text().trim());
                }

                if (author) {
                    var comment = {
                        author: author,
                        createdDate: createdAt,
                        content: content,
                        gamePermalink: req.query.game,
                        achievementPermalink: req.query.achievement
                    };

                    self.data.push(comment);
                }
            });
            
            if (self.data.length === 0)
                return res.status(404).send({ status: 404, message: 'Not Found.'});
            
            res.status(200).send(self.data);
        });
    });
    
    api.get('/games', function(req, res) {
        
        if (!config.checkApiKey(req.query.key))
            return res.status(403).send({ status: 403, message: 'Forbidden: Wrong or No API Key provided.'});
        
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
            
            self.data.games = [];
            self.data.numberOfPages = $(root).eq(1).find('.pagination').contents().last().prev().text() || 1;
            
            for (var i = 0; i < $(rows).length; i++) {
                 var game = {
                    title: $(rows).eq(i).find("strong").text().trim(),
                    coverUrl: baseUrl + $(rows).eq(i).find("td a img").attr("src").replace('ico', 'cover').trim(),
                    icoUrl: baseUrl + $(rows).eq(i).find("td a img").attr("src").trim(),
                    numberOfAchievements: $(rows).eq(i).find("td[align]").eq(0).text().trim(),
                    gamerScore: $(rows).eq(i).find("td[align]").eq(1).text().trim(),
                    gamePermalink: $(rows).eq(i).find("a").eq(0).attr('href').trim().replace('/game/', '').replace('/achievements/', '')
                 }
                 
                 self.data.games.push(game);
            }
            
            if (self.data === {})
                return res.status(404).send({ status: 404, message: 'Not Found.'});
            
            return res.status(200).send(self.data);
        });
    });
    
    api.get('/comments', function(req, res) {
        
        if (!config.checkApiKey(req.query.key))
            return res.status(403).send({ status: 403, message: 'Forbidden: Wrong or No API Key provided.'});
            
        var self = this;
        
        self.data = [];
        
        if (req.query.permalink){
            var url = baseUrl + '/' + req.query.permalink;
            
            request.get(url, function (error, response, html) {
                       
                var $ = cheerio.load(html);
    
                var comments = $('.bl_la_main .divtext table tr');
                
                $(comments).each(function(pos, value){
                    if (error) return res.status(404).send(error);
                    
                    var author = $(value).find('td[width=334] a').eq(1).text().trim();
                    var createdAt = $(value).find('td[width=334] .newsNFO').text().trim();
                    var content = '';
                    
                    for (var i = 0; i < $(value).next().find('td[colspan=3]').eq(0).contents().length; i++) {
                        var text = $(value).next().find('td[colspan=3]').eq(0).contents().eq(i).text().trim();
                        
                        content = (text) ? text : "\n";
                    }
                    
                    if (author) {
                        var comment = {
                            author: author,
                            createdDate: createdAt,
                            content: content
                        };
            
                        self.data.push(comment);
                    }
                });
                
                if (self.data.length === 0)
                    return res.status(404).send({ status: 404, message: 'Not Found.'});
    
                return res.status(200).send(self.data);
            });
        } else if (req.query.nID){
            request.post({
                url: 'http://www.xboxachievements.com/news2-loadcomments.php',
                form: {nID: req.query.nID}
            }, function (error, response, html) {
                var $ = cheerio.load(html);
    
                var comments = $('table tr');
    
                $(comments).each(function(i, value){
    
                    var author = $(value).find('td[width=334] a').eq(1).text().trim();
                    var createdAt = $(value).find('td[width=334] .newsNFO').text().trim();
                    var content = '';
                    
                    for (var i = 0; i < $(value).next().find('td[colspan=3]').eq(0).contents().length; i++) {
                        var text = $(value).next().find('td[colspan=3]').eq(0).contents().eq(i).text().trim();
                        
                        content = (text) ? text : "\n";
                    }
    
                    if (author) {
                        var comment = {
                            author: author,
                            createdDate: createdAt,
                            content: content
                        };
    
                        self.data.push(comment);
                    }
                });
    
                if (self.data === {})
                    return res.status(404).send({ status: 404, message: 'Not Found.'});
    
                return res.status(200).send(self.data);
            });
        }
    });
    
    api.get('/upcoming/games', function(req, res) {
        
        // category: NTSC, PAL, Arcade, xbox-one, xbox-360
        
        if (!config.checkApiKey(req.query.key))
            return res.status(403).send({ status: 403, message: 'Forbidden: Wrong or No API Key provided.'});
        
        var self = this;
        self.data = [];

        if (!req.query.category)
            req.query.category = 'NTSC';
            
        var url = (req.query.category.toUpperCase() === 'NTSC') ? baseUrl + '/upcoming/' : baseUrl + '/upcoming/' + req.query.category + '/'; 
            
        request(url, function(error, response, html) {
            if (error) return res.status(404).send(error);

            var $ = cheerio.load(html);
            
            var root = $('.bl_la_main .divtext table tr');
            
            for (var i = 2; i < $(root).length; i++) {
                var game = {
                    date: $(root).eq(i).find('td').eq(0).text().trim(),
                    game: $(root).eq(i).find('td').eq(1).text().trim(),
                    gamePermalink: $(root).eq(i).find('td a').eq(0).attr('href').trim().replace('/game/', '').replace('/overview/', '')
                }
                
                self.data.push(game);
            }
            
            return res.status(200).send(self.data);
        });
    });
};