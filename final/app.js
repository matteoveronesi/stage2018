const express = require('express');
const colors = require('colors');
const route = require('./routes/index');
const app = express();

app.use(express.static('files'));

//app.use('/', mainRoute);
app.get('/', (req, res) => res.render('index'));
app.use('/:name', route);

app.listen(8080, () => console.log('[app.js] listening on localhost:8080'.green));
