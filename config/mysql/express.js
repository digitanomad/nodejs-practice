module.exports = function() {
    var express = require('express');
    var session = require('express-session');
    var MySQLStore = require('express-mysql-session')(session);
    var bodyParser = require('body-parser');

    var app = express();
    app.set('views', './views/mysql');
    app.set('view engine', 'pug');
    app.use(session({
        secret: 'ekenirqkqwlek2sd',
        resave: false,
        saveUninitialized: true,
        store: new MySQLStore({
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: 'password',
            database: 'o2'
        })
    }));
    app.use(bodyParser.urlencoded({ extended: false }));

    return app;
}