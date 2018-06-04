const express = require("express");
const parser = require("body-parser");
const request = require("request");
const colors = require("colors");
const router = express.Router();
const encoded = parser.urlencoded({ extended: false });

var data; //JSON delle issue del progetto
var table; //html di output delle issue

/* DATI UTENTE */
var login = {"user": "99mv66", "pass": "stage.2018"};
var host = "http://stage.gnet.it";
var rest = "/rest/api/latest";
var project = "TODO";

function getTime(){ return new Date().toLocaleTimeString(); }

function extractIssues(){
	table = "";
	for (var i = 0; i < data.total; i++){
		table += '<tr id="'+i+'">';
		table += '<td title="Cambia Status" onclick="status('+i+')" class="td-status"><i class="material-icons icon-padding">';
		if (data.issues[i].fields.status.name === "To Do")
			table += 'check_box_outline_blank';
		else
			table += 'check_box';
		table += '</i></td>';
		table += '<td title="Vedi Issue" class="td-key w3-white w3-small"><p><a href="http://stage.gnet.it/browse/'+data.issues[i].key+'" target="_blank">'+data.issues[i].key+'</a></p></td>';
		table += '<td title="Cambia Nome" class="td-name"><input class="w3-input input" type="text" placeholder="'+data.issues[i].fields.summary+'" value="'+data.issues[i].fields.summary+'"></td>';
		table += '<td><i title="Conferma" onclick="edit('+i+')" class="material-icons icon-padding">mode_edit</i> <i title="Elimina" onclick="del('+i+')" class="material-icons">delete</i></td>';
		table += '</tr>';
	}
	return table;
}

function getIssues(){
	return new Promise( function (resolve, reject) {
		request.get({
			url: host + rest + "/search?jql=project=" + project + "&maxResults=200",
		    auth: login
		}, function (err, res, body){
			if (err)
				reject(" ERROR: " + err);
			else
				data = JSON.parse(body);
			resolve(body);
		});
	})
}

router.get("/issues", function(req, res){
	console.log("\n(" + getTime() + ")");
    console.log(" REQUEST:".cyan);
	console.log(" type: GET(load)");
    console.log(" url: " + req.headers.host + req.originalUrl);
	console.log(" RESPONSE:".cyan);

	getIssues().then(function (output){
		res.send(extractIssues());
		console.log(" status: 200 (sent)");
	}).catch(function (output) {
		console.log(colors.red("%s",output));
	});
});

router.post("/edit/status", encoded, function(req, res){
	console.log("\n(" + getTime() + ")");
    console.log(" REQUEST:".cyan);
	console.log(" type: POST(edit status)");
    console.log(" url: " + req.headers.host+req.originalUrl);
    console.log(" key: " + req.body.key);
    console.log(" status: " + req.body.status);
	console.log(" RESPONSE:".cyan);

	request.post({
		url: host + rest + "/issue/" + req.body.key + "/transitions",
		auth: login,
		json: {
			"transition": {
						"id": req.body.status
			}
		}
	}, function(err, res, body){
		if (err)
			console.log(colors.red(" ERROR: %s"), err);
		else
			console.log(" status: 200 (edited)");
	});
});

router.put("/edit/summary", encoded, function(req, res){
	console.log("\n(" + getTime() + ")");
    console.log(" REQUEST:".cyan);
	console.log(" type: PUT(edit summary)");
	console.log(" url: " + req.headers.host + req.originalUrl);
    console.log(" key: " + req.body.key);
    console.log(" summary: " + req.body.summary);
	console.log(" RESPONSE:".cyan);

	request.put({
		url: host + rest + "/issue/" + req.body.key,
		auth: login,
		json: {
	    "fields": {
	        "summary": req.body.summary
   		}
	}
	}, function(err, res, body){
		if (err)
			console.log(colors.red(" ERROR: %s"), err);
		else
			console.log(" status: 200 (edited)");
	});
});

router.post("/add", encoded, function(req, res){
	console.log("\n(" + getTime() + ")");
    console.log(" REQUEST:".cyan);
	console.log(" type: POST(add)");
    console.log(" url: " + req.headers.host+req.originalUrl);
    console.log(" key: " + req.body.key);
    console.log(" summary: " + req.body.summary);
    console.log(" status: " + req.body.status);
	console.log(" RESPONSE:".cyan);

	request.post({
		url: host + rest + "/issue",
		auth: login,
		json: {
	    "fields": {
	        "project":
	        {
	            "key": project
	        },
	        "summary": req.body.summary,
	        "description": "",
	        "issuetype": {
	            "name": "Task"
	        }
   		}
	}
	}, function(err, res, body){
		if (err)
			console.log(colors.red(" ERROR: %s"), err);
		else
			console.log(" status: 200 (edited)");
	});
});

router.delete("/delete", encoded, function(req, res){
	console.log("\n(" + getTime() + ")");
    console.log(" REQUEST:".cyan);
	console.log(" type: DELETE(delete)");
    console.log(" url: " + req.headers.host + req.originalUrl);
	console.log(" key: " + req.body.key);
	console.log(" RESPONSE:".cyan);

	request.delete({
		url: host + rest + "/issue/" + req.body.key,
	    auth: login
	}, function (err, res, body){
		if (err)
			console.log(colors.red(" ERROR: %s"), err);
		else
			console.log(" status: 200 (edited)");
	});
});

module.exports = router;
