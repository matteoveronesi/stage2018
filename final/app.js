const express = require('express');
const colors = require('colors');
const routes = require('./routes/index2');
const app = express();

app.use(express.static('files'));

app.get('/', (req, res) => res.render('index'));

app.use('/rest', routes);

app.listen(8080, () => console.log('[app.js] listening on localhost:8080'.green));
