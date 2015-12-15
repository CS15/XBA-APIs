// modules
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var config = require('../config/config');
var path = require('path');
var compression = require('compression');
var Parse = require('parse/node').Parse;

// instantiate express app
var app = express();

module.exports = function () {

    // middlewares
    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    } else if (process.env.NODE_ENV === 'production') {
        app.use(compression());
    }

    // use body parser & cookie parser
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    
    Parse.initialize("ZbsmNrnAoWvV4miJsVzkr4qwSlodOyFzhYWHECbI", "PdB18ikRbBJPjuErs8b2I8kNwczL17bGceMc7qD8");

    // static roots
    app.use('/css', express.static(path.resolve('./public/css')));
    app.use('/lib', express.static(path.resolve('./public/lib')));
    app.use('/js', express.static(path.resolve('./public/js')));
    app.use('/scripts', express.static(path.resolve('./node_modules')));
    app.use('/views', express.static(path.resolve('./public/views')));

    // routes
    require('../app/routes/api')(app, express);
    require('../app/routes/xbox-apis')(app, express);
    require('../app/routes/routes')(app);

    // return instance of express
    return app;
};
