var express = require('express');
var mainRoute = require('./routes/main');
var app = express();

app.set('views', './views');
app.set('view engine', 'pug');
app.use('/', mainRoute);
app.use(express.static('views'));

app.listen(9000);
