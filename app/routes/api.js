var request = require('request');
var cheerio = require('cheerio');

module.exports = function (app, express) {
    // router
    var api = express.Router();
    var baseUrl = "http://www.xboxachievements.com";

    // prefix api route
    app.use('/api', api);

    api.get('/latest/news', function (req, res) {

        var self = this;

        if (!req.query.page)
            req.query.page = 1;

        self.url = 'http://www.xboxachievements.com/archive/gaming-news/' + req.query.page + '/';
        self.data = [];

        request(self.url, function (error, response, html) {
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
                        link: baseUrl + $(value).find('a').attr('href'),
                        permalink: $(value).find('a').attr('href').replace('/news/', '').replace('.html', '')
                    };

                    data.push(news);
                }
            });

            if (self.data.length > 0)
                return res.status(200).send(self.data);

            return res.status(404).send({ status: 404, message: 'Not Found.'});
        });
    });

    api.get('/news/:permalink', function (req, res) {

        var self = this;

        self.data = {};
        self.permalink = req.params.permalink;
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
            self.data.datePublished = $(root).find('table td div.newsNFO span[itemprop=datePublished]').text();
            self.data.title = $(root).find('table td h1.newsTitle').text();
            self.data.content = [];
            self.data.images = [];
            self.data.videos = [];
            self.data.comments = [];

            $(root).find('[itemprop=articleBody] p').each(function(index, value){
                if ($(value).text().trim() != '') {
                    self.data.content.push($(value).text().trim());
                }
            });

            $(root).find('[itemprop=articleBody] img').each(function (i, value) {
                self.data.images.push(value.attribs.src);
            });

            $(root).find('[itemprop=articleBody] iframe').each(function (i, value) {
                self.data.videos.push(value.attribs.src);
            });

            request.post({
                url: 'http://www.xboxachievements.com/news2-loadcomments.php',
                form: {nID: self.nID}
            }, function (error, response, html) {
                var $ = cheerio.load(html);

                var comments = $('table tr');

                $(comments).each(function(i, value){

                    var author = $(value).find('td[width=334] a').eq(1).text().trim();
                    var createdAt = $(value).find('td[width=334] .newsNFO').text().trim();
                    var content = $(value).next().find('td[colspan=3]').text().trim();

                    if (author) {
                        var comment = {
                            author: author,
                            createdDate: createdAt,
                            content: content
                        };

                        self.data.comments.push(comment);
                    }
                });

                if (self.data)
                    return res.status(200).send(self.data);

                return res.status(404).send({ status: 404, message: 'Not Found.'});
            });

        });
    });

    api.get('/latest/achievements', function(req, res){

        var self = this;

        if (!req.query.page)
            req.query.page = 1;

        self.data = [];
        self.url = 'http://www.xboxachievements.com/archive/achievements/' + req.query.page + '/';

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

                var ach = {
                    title: title,
                    imageUrl: baseUrl + imageUrl,
                    link: baseUrl + link,
                    achievementsAdded: contents[0].trim() + '.',
                    submittedBy: contents[1].trim() + '.',
                    permalink: link.replace('/game/', '').replace('/achievements/', '')
                };

                self.data.push(ach);

                counter += 2;
            }

            if (self.data.length > 0)
                return res.status(200).send(self.data);

            return res.status(404).send({ status: 404, message: 'Not Found.'});
        });
    });

    api.get('/game/achievements/:permalink', function(req, res){

        var self = this;

        self.data = [];
        self.permalink = req.params.permalink;
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
                    permalink: permalink
                };

                counter += 2;

                self.data.push(achievement);
            }

            if (self.data.length > 0)
                return res.status(200).send(self.data);

            return res.status(404).send({ status: 404, message: 'Not Found.'});
        });
    });

    api.get('/game/screenshots/:permalink', function (req, res){
        var self = this;

        if (!req.query.page)
            req.query.page = 1;

        self.data = [];
        self.permalink = req.params.permalink;
        self.url = baseUrl + '/game/' + self.permalink + '/screenshots/' + req.query.page + '/';

        request(self.url, function(error, response, html) {
            if (error) return res.status(404).send(error);

            var $ = cheerio.load(html);

            var root = $('div.bl_la_main div.divtext table tr img');

            $(root).each(function (index, value){
                var image = baseUrl + $(value).attr('src').replace('thu', 'med');

                self.data.push(image);
            });

            if (self.data.length > 0)
                return res.status(200).send(self.data);

            return res.status(404).send({ status: 404, message: 'Not Found.'});
        });
    });
};