var express = require('express');
var router = express.Router();

var issues={
	'Sviluppare prole': 'Todo',
	'Finire debug di tizio': 'Todo',
	'Caricare il progetto Bananas': 'Wip',
	'Fare backup server': 'Done',
	'Comprare nuovo router': 'Wip'
};

router.get('/', function(req, res) {
  res.render('index', { issues: issues });
});

module.exports = router;
