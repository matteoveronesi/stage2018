const express = require('express');
const colors = require('colors');
const login = require('./routes/login');
const routes = require('./routes/index');
const app = express();

app.use(express.static('files'));

//app.get('/', (req, res) => res.render('index'));

app.use('/rest', routes);
//app.use('/login', login);
app.listen(9000, () => console.log('[app.js] listening on port 9000'.green));
