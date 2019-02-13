var express = require('express');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var bodyParser = require('body-parser');
var bkfd2Password = require("pbkdf2-password");
var hasher = bkfd2Password();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var app = express();
app.use(session({
    secret: 'ekenirqkqwlek2sd',
    resave: false,
    saveUninitialized: true,
    store: new FileStore()
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());
var users = [
    {
        username: 'egoing',
        password: '8N4HTK31JkplqNoDB3Llc5DY6C7tlSqGb9AU3U4xFaEm+kXBuzirtlI8z362ri1LnuiV1IXAxhrSfHOiIATiYMpiar5vBGQBZILPdDUFRzGqM2FGF6umHnagRU79krP7iyJrC+ToQaDC/KAl9AC1tGhBDMZ6HXdncB14tLQ11GM=',
        salt: 'Aba1Fq/rgWm68KI3DN4lXi2MTTNYZJj28oG1jkrVZ367lM2Dw+Kdc0S2UyGxrsXnwS12iEq9WLr5tJ4fgA+ncQ==',
        displayName: 'Egoing'
    }
];

passport.use(new LocalStrategy(
    function(username, password, done) {
        var uname = username;
        var pwd = password;

        for (var i = 0; i < users.length; i++) {
            var user = users[i];
            if (uname === user.username) {
                return hasher({ password: pwd, salt: user.salt }, function(err, pass, salt, hash) {
                    if (hash === user.password) {
                        console.log('LocalStrategy', user);
                        done(null, user);
                    } else {
                        done(null, false);
                    }
                });
            }
        }

        done(null, false);
    }
));
passport.serializeUser(function(user, done) {
    console.log('serializeUser', user);
    done(null, user.username);
});
passport.deserializeUser(function(id, done) {
    console.log('deserializeUser', id);
    for (var i = 0; i < users.length; i++) {
        var user = users[i];
        if (user.username === id) {
            return done(null, user);
        }
    }
});
app.post('/auth/login',
    passport.authenticate('local', { successRedirect: '/welcome',
                                     failureRedirect: '/auth/login',
                                     failureFlash: false })
);
app.get('/auth/logout', function(req, res) {
    req.logout();
    req.session.save(function() {
        res.redirect('/welcome');
    });
});
app.get('/welcome', function(req, res) {
    if (req.user && req.user.displayName) {
        res.send(`
            <h1>Hello, ${req.user.displayName}</h1>
            <a href="/auth/logout">Logout</a>
        `);
    } else {
        res.send(`
            <h1>Welcome</h1>
            <ul>
                <li><a href="/auth/login">Login</a></li>
                <li><a href="/auth/register">Register</a></li>
            </ul>
        `);
    }
});
app.post('/auth/register', function(req, res) {
    hasher({ password: req.body.password}, function(err, pass, salt, hash) {
        var user = {
            username: req.body.username,
            password: hash,
            displayName: req.body.displayName,
            salt: salt
        };
        users.push(user);
        req.login(user, function(err) {
            req.session.save(function() {
                res.redirect('/welcome');
            });
        });
    });
});
app.get('/auth/register', function(req, res) {
    var output = `
    <h1>Register</h1>
    <form action="/auth/register" method="post">
        <p>
            <input type="text" name="username" placeholder="username" />
        </p>
        <p>
            <input type="password" name="password" placeholder="password" />
        </p>
        <p>
            <input type="text" name="displayName" placeholder="displayName" />
        </p>
        <p>
            <input type="submit">
        </p>
    </form>
    `;

    res.send(output);
});
app.get('/auth/login', function(req, res) {
    var output = `
    <h1>Login</h1>
    <form action="/auth/login" method="post">
        <p>
            <input type="text" name="username" placeholder="username" />
        </p>
        <p>
            <input type="password" name="password" placeholder="password" />
        </p>
        <p>
            <input type="submit">
        </p>
    </form>
    `;

    res.send(output);
});

app.listen(3003, function() {
    console.log('Connected 3003 port!!!');
});