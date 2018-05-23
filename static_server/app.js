var express = require('express');
var app = express();

var issues={
	'Comprare Banane': 'Todo',
	'Estendere Banane': 'Todo',
	'Posizionare Banane': 'Todo',
	'Vendere Banane': 'Done',
	'Creare Banane': 'Wip'
};

app.use(express.static('public'));
app.set('views', './views');
app.set('view engine', 'pug');

app.get('/', function (req, res) {
  res.render('index', {
	issues: issues,
  });
});

app.listen(8080);
