var express = require('express');
var app = express();
app.use(express.static('public'));
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