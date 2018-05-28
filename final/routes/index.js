const express = require('express');
const router = express.Router();

var id=["TODO-6","TODO-7","TODO-2","TODO-3"];
var summary=["Finire il progetto 6","Finire il progetto 7","Finire il progetto 2","Finire il progetto 3"];
var status=["Todo","Todo","Done","Todo"];

router.get('/', (req, res) => res.render('index', { id: id, summary: summary, status: status}));

module.exports = router;
