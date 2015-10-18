/**
 * @description : modules
 */
var request = require('request');
var cheerio = require('cheerio');
var config = require('../../config/config');
var path = require('path');

/**
 * @description : RESTful api's
 *
 * @param app : express app instance.
 * @param express : express module.
 */
module.exports = function (app, express) {
    // router
    var api = express.Router();
    var baseUrl = "http://www.xboxachievements.com";

    // prefix api route
    app.use('/api', api);

    api.get('/latestnews', function (req, res) {

        if (!req.query.page)
            req.query.page = 1;

        var url = 'http://www.xboxachievements.com/archive/gaming-news/' + req.query.page + '/';

        request(url, function (error, response, html) {
            if (error) res.status(404).send(erro);

            var $ = cheerio.load(html);

            var rows = $('div.bl_la_main div.divtext table[width=638] tr');

            var data = [];

            rows.each(function (index, value) {
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

            res.send(data);
        });
    });

    api.get('/news/:permalink', function (req, res) {

        var permalink = req.params.permalink;
        var url = baseUrl + '/news/' + permalink + '.html';

        var nID = permalink.substr(permalink.indexOf('-') + 1);
        nID = nID.substr(0, nID.indexOf('-'));

        request(url, function (error, response, html) {
            var self = this;

            if (error) return res.status(404).send(error);

            var $ = cheerio.load(html);

            var article = $('div.articleText');

            self.data = {};

            self.data.nID = nID;
            self.data.authorAvatar = baseUrl + $(article).find('table td[width=65] img').attr('src');
            self.data.authorName = $(article).find('table td div.newsNFO span[itemprop=name]').text();
            self.data.datePublished = $(article).find('table td div.newsNFO span[itemprop=datePublished]').text();
            self.data.title = $(article).find('table td h1.newsTitle').text();
            self.data.content = [];//$(article).find('[itemprop=articleBody] p').text().trim();
            self.data.images = [];
            self.data.videos = [];
            self.data.comments = [];

            $(article).find('[itemprop=articleBody] p').each(function(index, value){
                if ($(value).text().trim() != '') {
                    self.data.content.push($(value).text().trim());
                }
            });

            $(article).find('[itemprop=articleBody] img').each(function (i, value) {
                self.data.images.push(value.attribs.src);
            });

            $(article).find('[itemprop=articleBody] iframe').each(function (i, value) {
                self.data.videos.push(value.attribs.src);
            });

            request.post({
                url: 'http://www.xboxachievements.com/news2-loadcomments.php',
                form: {nID: nID}
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

                res.status(200).send(self.data);
            });

        });
    });

    api.get('/latestachievements', function(req, res){

        if (!req.query.page)
            req.query.page = 1;

        var url = 'http://www.xboxachievements.com/archive/achievements/' + req.query.page + '/';

        request(url, function(error, response, html){
            if (error) res.status(404).send(erro);

            var self = this;

            var counter = 0;

            var $ = cheerio.load(html);

            var rows = $('div.bl_la_main div.divtext table tr');

            self.data = [];

            for (var i = 0; i < $(rows).find('.newsTitle').length; i++){

                var title = $(rows).find('.newsTitle a').eq(i).text().replace('Game Added:', '').replace('DLC Added:', '').trim();
                var imageUrl = $(rows).find('td[width=70] img').eq(i).attr('src');
                var link = $(rows).find("td[width=442] a").eq(counter).attr('href');
                var achAdded = $(rows).find("td[width=442]").eq(i);

                if ($(achAdded).find('p').length > 0)
                    achAdded = $(achAdded).find('p').text().trim();
                else
                    achAdded = $(achAdded).text().trim();

                var ach = {
                    title: title,
                    imageUrl: baseUrl + imageUrl,
                    link: baseUrl + link,
                    achAdded: achAdded
                };

                self.data.push(ach);

                counter += 2;
            }

            res.send(self.data);
        });
    });
};