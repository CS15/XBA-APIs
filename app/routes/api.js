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

        var url = baseUrl + '/news/' + req.params.permalink + '.html';

        request(url, function (error, response, html) {

            if (error) return res.status(404).send(error);

            var $ = cheerio.load(html);

            var article = $('div.articleText');

            var data = {};

            data.authorAvatar = $(article).find('table td[width=65] img').attr('src');
            data.authorName = $(article).find('table td div.newsNFO span[itemprop=name]').text();
            data.datePublished = $(article).find('table td div.newsNFO span[itemprop=datePublished]').text();
            data.title = $(article).find('table td h1.newsTitle').text();
            data.content = $(article).find('[itemprop=articleBody] p').text().trim();
            data.images = [];
            data.videos = [];

            $(article).find('[itemprop=articleBody] img').each(function(i, value){
                data.images.push(value.attribs.src);
            });

            $(article).find('[itemprop=articleBody] iframe').each(function(i, value){
                data.videos.push(value.attribs.src);
            });

            res.status(200).send(data);
        });
    });
};