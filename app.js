var express = require('express');
var app = express();
app.get('/', function(req, res) {
    res.send('Hello homepage');
});
app.get('/login', function(req, res) {
    res.send('<h1>Login please</h1>');
});
app.get('/main', function(req, res) {
    res.send('Main page');
});
app.listen(3000, function() {
    console.log('Connected to 3000 port.');
});