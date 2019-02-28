module.exports = function(passport) {
    var route = require('express').Router();
    var bkfd2Password = require("pbkdf2-password");
    var hasher = bkfd2Password();
    var conn = require('../../config/mysql/db')();

    route.post('/login',
        passport.authenticate('local', { successRedirect: '/welcome',
                                        failureRedirect: '/auth/login',
                                        failureFlash: false })
    );
    route.get('/logout', function(req, res) {
        req.logout();
        req.session.save(function() {
            res.redirect('/welcome');
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
                        res.redirect('/welcome');
                    });
                });
            });
        });
    });
    route.get('/register', function(req, res) {
        res.render('auth/register');
    });
    route.get('/login', function(req, res) {
        res.render('auth/login');
    });

    return route;
};