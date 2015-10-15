/**
 * @description : modules
 */
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

    // prefix api route
    app.use('/api', api);
};