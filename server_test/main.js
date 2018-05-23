/*
 * Test Client-Side node application
*/

var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({ extended: false });

var cities = ['Lotopia', 'Caspiana', 'Indigo','Banana'];
var createCity = function(name, description){
  cities[name] = description;
  return name;
};

app.use(express.static('public')); // usa la directory public

app.get('/cities', function(request, response)
{
  response.status(201).send(cities);
});

app.post('/cities', parseUrlencoded, function (request, response) {
  if(request.body.description.length > 4){
    var city = createCity(request.body.name, request.body.description);
    response.status(201).json(city);
  }else{
    response.status(400).json('Invalid City');
  }
});

app.delete('/cities/:name', function(request, response) {
delete cities[request.cityName];
response.sendStatus(200);
});

app.listen(8080);
