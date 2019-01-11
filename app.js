var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.locals.pretty = true;
app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.get('/form', function(req, res) {
    res.render('form');
});
app.get('/form_receiver', function(req, res) {
    var title = req.query.title;
    var description = req.query.description;
    res.send(title + ', ' + description);
});
app.post('/form_receiver', function(req, res) {
    var title = req.body.title;
    var description = req.body.description;
    res.send(title + ', ' + description);
});
app.get('/topic/:id', function(req, res) {
    var topics = [
        'Javascript is...',
        'Nodejs is...',
        'Express is...'
    ];
    var output = `
    <a href="/topic/0">Javasciprt</a><br>
    <a href="/topic/1">Nodejs</a><br>
    <a href="/topic/2">Express</a><br><br>
    ${topics[req.params.id]}
    `
    res.send(output);
});
app.get('/topic/:id/:mode', function(req, res){
    res.send(req.params.id + ', ' + req.params.mode);
});
app.get('/template', function(req, res) {
    res.render('temp', {time: Date(), _title: 'pug'});
});
app.get('/', function(req, res) {
    res.send('Hello homepage');
});
app.get('/route', function(req, res) {
    res.send('Hello Router, <img src="/3534236.jpeg" />');
});
app.get('/dynamic', function(req, res) {
    var lis;
    for (var i = 0; i < 5; i++) {
        lis += '<li>coding</li>';
    }
    var time = Date();
    
    var output = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Document</title>
    </head>
    <body>
        <ul>
        Hello, Dynamic!
        ${lis}
        </ul>
        ${time}
    </body>
    </html>`;
    res.send(output);
});
app.get('/login', function(req, res) {
    res.send('<h1>Login please</h1>');
});
app.listen(3000, function() {
    console.log('Connected to 3000 port.');
});                               