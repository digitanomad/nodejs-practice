module.exports = function(passport) {
    var route = require('express').Router();
    var bkfd2Password = require("pbkdf2-password");
    var hasher = bkfd2Password();
    var conn = require('../../config/mysql/db')();

    route.post('/login',
        passport.authenticate('local', { successRedirect: '/topic',
                                        failureRedirect: '/auth/login',
                                        failureFlash: false })
    );
    route.get('/logout', function(req, res) {
        req.logout();
        req.session.save(function() {
            res.redirect('/topic');
        });
    });
    route.post('/register', function(req, res) {
        hasher({ password: req.body.password}, function(err, pass, salt, hash) {
            var user = {
                authId: 'local:' + req.body.username,
                username: req.body.username,
                password: hash,
                displayName: req.body.displayName,
                salt: salt,
                email: 'email:' + req.body.username
            };

            var sql = "INSERT INTO USERS SET ?";
            conn.query(sql, user, function(err, results) {
                if (err) {
                    console.log(err);
                    res.status(500);
                }

                req.login(user, function(err) {
                    req.session.save(function() {
                        res.redirect('/topic');
                    });
                });
            });
        });
    });
    route.get('/register', function(req, res) {
        var sql = 'SELECT id, title FROM topic';
        conn.query(sql, function(err, topics, fields) {
            res.render('auth/register', { topics: topics });
        });
    });
    route.get('/login', function(req, res) {
        var sql = 'SELECT id, title FROM topic';
        conn.query(sql, function(err, topics, fields) {
            res.render('auth/login', { topics: topics });
        });
    });

    return route;
};