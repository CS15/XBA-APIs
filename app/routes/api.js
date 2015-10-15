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

    api.get('/news', function (req, res) {

        var url = 'http://www.xboxachievements.com/archive/gaming-news/1/';

        request(url, function (error, response, html) {
            if (!error) {
                var $ = cheerio.load(html);

                var rows = $('div.bl_la_main div.divtext table[width=638] tr');

                var data = [];

                rows.each(function(index, value){
                    if (index % 2 == 0){

                        console.log($(value).find('.newsNFO').next().text());

                        var news = {
                            title: $(value).find('.newsTitle a').text(),
                            subtitle: $(value).find('.newsNFO').next().text(),
                            imageUrl: baseUrl + $(value).find('img').attr('src'),
                            author: $(value).find('.newsNFO').text(),
                            link: baseUrl + $(value).find('a').attr('href')
                        };

                        data.push(news);
                    }
                });

                res.send(data);
            }
        });
    });
};