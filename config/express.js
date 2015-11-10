// modules
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var config = require('../config/config');
var path = require('path');
var compression = require('compression');

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

    // static roots
    app.use('/css', express.static(path.resolve('./public/css')));
    app.use('/js', express.static(path.resolve('./public/js')));
    app.use('/scripts', express.static(path.resolve('./node_modules')));
    app.use('/views', express.static(path.resolve('./public/views')));

    // create database
    //mongoose.connect(config.server.db);

    // routes
    require('../app/routes/api')(app, express);
    require('../app/routes/xbox-apis')(app, express);
    require('../app/routes/ps-apis')(app, express);
    require('../app/routes/routes')(app);

    // return instance of express
    return app;
};
