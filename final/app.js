const express = require('express');
const mainRoute = require('./routes/index');
const issueRoute = require('./routes/issue');
const app = express();

app.use(express.static('files'));

app.use('/', mainRoute);
app.use('/:name', issueRoute);

app.listen(9000, () => console.log('Listening on port 9000.'));
