const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const parseUrlencoded = bodyParser.urlencoded({ extended: false });

var id = ["TODO-6","TODO-7","TODO-2","TODO-3","TODO-9","TODO-6","TODO-7","TODO-2","TODO-3","TODO-9","TODO-6","TODO-7","TODO-2","TODO-3","TODO-9"];
var summary = ["Finire il progetto 6","Finire il progetto 7","Finire il progetto 2","Finire il progetto 3","Finire il progetto 9","Finire il progetto 6","Finire il progetto 7","Finire il progetto 2","Finire il progetto 3","Finire il progetto 9","Finire il progetto 6","Finire il progetto 7","Finire il progetto 2","Finire il progetto 3","Finire il progetto 9"];
var status = ["Todo","Todo","Done","Done","Todo","Todo","Todo","Done","Done","Todo","Todo","Todo","Done","Done","Todo"];

var table;

function buildTable(){
  for (var i = 0; i < id.length; i++){
    table += '<tr id="'+i+'">';
    table += '<td class="td-key"><input class="w3-input w3-white" type="text" placeholder="'+id[i]+'" disabled></td>';
    table += '<td class="td-name"><input class="w3-input w3-white" type="text" placeholder="'+summary[i]+'" disabled></td>';
    table += '<td class="td-status '+status[i]+'">'+status[i]+'</td>';
    table += '<td><i onclick="edit('+i+')" class="material-icons">mode_edit</i> <i onclick="del('+i+')" class="material-icons">delete</i></td>';
    table += '</tr>';
  }
  return table;
}

router.all('/', function(req, res, next){
  table = "";
  next();
});

router.get('/', function(req, res){
  res.send(buildTable());
  console.log("\n# REQUESTED <LOAD TABLE> CALL");
  res.status(200);
});

router.post('/', parseUrlencoded, function(req, res){
  if (req.originalUrl.replace("/","") === "new") console.log("\n# REQUESTED <ADD> CALL");
  else console.log("\n# REQUESTED <EDIT> CALL");
  console.log(
    "# key: "+req.body.key+
    "\n# summary: "+req.body.summary+
    "\n# status: "+req.body.status
  );
  res.status(200);
});

router.delete('/', parseUrlencoded, function(req, res){
  console.log("\n# REQUESTED <DELETE> CALL");
  console.log("# key: "+req.body.key);
  res.status(200);
});

module.exports = router;
