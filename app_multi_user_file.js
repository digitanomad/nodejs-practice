var express = require('express');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var bodyParser = require('body-parser');
var sha256 = require('sha256');
var app = express();
app.use(session({
    secret: 'ekenirqkqwlek2sd',
    resave: false,
    saveUninitialized: true,
    store: new FileStore()
}));
app.use(bodyParser.urlencoded({ extended: false }));
var users = [
    {
        username: 'egoing',
        password: 'd0c0e8247e29f545c60d98f6c2adbac7af37f42b5156bb9d161db09220e5b410',
        salt: '!dsfsdr213',
        displayName: 'Egoing'
    },
    {
        username: 'KBB85',
        password: '832094071f95cfaeb543ed8291b427c302f4ad939d93a527081047165cfe092d',
        salt: '21ijodfi1mk',
        displayName: 'K5'
    }
];

app.get('/count', function(req, res) {
    if (req.session.count) {
        req.session.count++;
    } else {
        req.session.count = 1;
    }
    res.send('count : ' + req.session.count);
});
app.post('/auth/login', function(req, res) {
    var uname = req.body.username;
    var pwd = req.body.password;

    for (var i = 0; i < users.length; i++) {
        var user = users[i];
        if (uname === user.username && sha256(pwd + user.salt) === user.password) {
            req.session.displayName = user.displayName;
            return req.session.save(function() {
                res.redirect('/welcome');
            });
        }
    }

    res.send('Who are you?  <a href="/auth/login">login</a>');
});
app.get('/auth/logout', function(req, res) {
    delete req.session.displayName;
    res.redirect('/welcome');
});
app.get('/welcome', function(req, res) {
    if (req.session.displayName) {
        res.send(`
            <h1>Hello, ${req.session.displayName}</h1>
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
    var user = {
        username: req.body.username,
        password: req.body.password,
        displayName: req.body.displayName
    };

    users.push(user);

    req.session.displayName = req.body.displayName;
    req.session.save(function() {
        res.redirect('/welcome');
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