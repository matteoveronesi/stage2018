const express = require('express');
const colors = require('colors');
const route = require('./routes/index');
const app = express();

app.use(express.static('files'));

app.get('/', (req, res) => res.render('index'));
app.use('/rest', route);

app.listen(8080, () => console.log('[app.js] listening on localhost:8080'.green));
