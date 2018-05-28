const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const parseUrlencoded = bodyParser.urlencoded({ extended: false });

router.post('/', parseUrlencoded, function(req, res){
  console.log(req.body.city + req.body.desc);
  res.status(200).send(req.body);
});
/*
router.post('/', (req, res) => console.log(req.originalUrl));
*/
router.delete('/', (req, res) => res.send("delete prova"));

module.exports = router;
