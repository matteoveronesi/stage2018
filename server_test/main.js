/*
 * Test Client-Side node application
*/

var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({ extended: false });

var cities = ['Lotopia', 'Caspiana', 'Indigo','Banane'];
var createCity = function(name, description){
  cities[name] = description;
  return name;
};

app.use(express.static('public'));

app.get('/cities', function(request, response)
{
  response.status(201).send(cities);
});

app.post('/cities', parseUrlencoded, function (request, response) {
  console.log(request.body);
  if(request.body.description.length > 0){
    var city = createCity(request.body.name, request.body.description);
    response.status(201).json(city);
  }else{
    response.status(400).json('Invalid City');
  }
});

app.post('/cities/:name', parseUrlencoded, function (request, response) {
  console.log();
  response.sendStatus(200);
});

app.delete('/cities/:name', function(request, response) {
  delete cities[request.cityName];
  response.sendStatus(200);
});

app.listen(8080);
