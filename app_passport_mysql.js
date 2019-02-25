var express = require('express');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var bodyParser = require('body-parser');
var bkfd2Password = require("pbkdf2-password");
var hasher = bkfd2Password();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mysql = require('mysql');
var conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'password',
  database : 'o2'
});
conn.connect();
var app = express();
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

        var sql = 'SELECT * FROM users WHERE authId=?';
        conn.query(sql, ['local:' + uname], function(err, results) {
            if (err) {
                return done('There is no user.');
            }
            var user = results[0];
            return hasher({ password: pwd, salt: user.salt }, function(err, pass, salt, hash) {
                if (hash === user.password) {
                    console.log('LocalStrategy', user);
                    done(null, user);
                } else {
                    done(null, false);
                }
            });
        });
    }
));
passport.serializeUser(function(user, done) {
    console.log('serializeUser', user);
    done(null, user.authId);
});
passport.deserializeUser(function(id, done) {
    console.log('deserializeUser', id);
    var sql = 'SELECT * FROM users WHERE authId=?';
    conn.query(sql, [id], function(err, results) {
        if (err) {
            console.log(err);
            done('There is no user.');
        }

        done(null, results[0]);
    });
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