const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const colors = require('colors');
const router = express.Router();
const parseUrlencoded = bodyParser.urlencoded({ extended: false });

var data; //JSON delle issue del progetto
var table; //html di output delle issue
var count = 0; //contatore dei messaggi
var login = {
	'user': '99mv66',
	'pass': 'stage.2018'
};

function extractIssues(){
	table = "";
	for (var i = 0; i< data.total; i++){
		table += '<tr id="'+i+'">';
		table += '<td onclick="status('+i+')" class="td-status "><i class="material-icons icon-padding">';
		if (data.issues[i].fields.status.name === "To Do")
			table += 'check_box_outline_blank';
		else
			table += 'check_box';
		table += '</i></td>';
		table += '<td class="td-key w3-white w3-small"><p><a href="http://stage.gnet.it/browse/'+data.issues[i].key+'" target="_blank">'+data.issues[i].key+'</a></p></td>';
		table += '<td class="td-name"><input class="w3-input  w3-white" type="text" placeholder="'+data.issues[i].fields.summary+'" value="'+data.issues[i].fields.summary+'"></td>';
		table += '<td><i onclick="edit('+i+')" class="material-icons icon-padding">mode_edit</i> <i onclick="del('+i+')" class="material-icons">delete</i></td>';
		table += '</tr>';
	}
	return table;
}

function setData(body){
	data = JSON.parse(body);
}

function getIssues(){
	return new Promise( function (resolve, reject) {
		request.get({
			url: 'http://stage.gnet.it/rest/api/latest/search?jql=project=TODO&maxResults=200',
		    auth: login
		}, function (err, res, body){
			if (res.errorMessages){
				reject("# ERROR: "+res);
				console.log("d");
			}

			setData(body);
			resolve(body);
		});
	})
}
getIssues();

router.get('/issues', function(req, res){
	++count;
	console.log("\n# ID "+count);
    console.log("# REQUEST:".cyan);
	console.log("# type: GET(load)");
    console.log("# url: "+req.headers.host+req.originalUrl);
	console.log("# RESPONSE:".cyan);

	getIssues().then(function (output){
		res.send(extractIssues());
		console.log("# status: 200 (sent)");
	}).catch(function (output) {
		console.log(colors.red("%s",output));
	});
});


router.put('/edit/summary', parseUrlencoded, function(req, res){
	++count;
	console.log("\n# ID "+count);
    console.log("# REQUEST:".cyan);
	console.log("# type: PUT(edit)");
	console.log("# url: "+req.headers.host+req.originalUrl);
    console.log("# key: "+req.body.key);
    console.log("# summary: "+req.body.summary);
    console.log("# status: "+req.body.status);
	console.log("# RESPONSE:".cyan);

	request.post({
		url: 'http://stage.gnet.it/rest/api/latest/issue/'+req.body.key+'/transitions',
		auth: login,
		json: {
			"transition": {
						"id": req.body.status
			}
		}
	}, function(err, res, body){
		console.log("# (FIELD)status:");
		if (err) console.log(colors.red("# -ERROR: %s"), err);
		else console.log("# -status: 200 (edited)");
	});

	request.put({
		url: 'http://stage.gnet.it/rest/api/latest/issue/'+req.body.key,
		auth: login,
		json: {
	    "fields": {
	        "summary": req.body.summary
   		}
	}
	}, function(err, res, body){
		console.log("# (FIELD)summary:");
		if (err) console.log(colors.red("# -ERROR: %s"), err);
		else console.log("# -status: 200 (edited)");
	});
});

router.post('/add', parseUrlencoded, function(req, res){
	++count;
	console.log("\n# ID "+count);
    console.log("# REQUEST:".cyan);
	console.log("# type: POST(add)");
    console.log("# url: "+req.headers.host+req.originalUrl);
    console.log("# key: "+req.body.key);
    console.log("# summary: "+req.body.summary);
    console.log("# status: "+req.body.status);
	console.log("# RESPONSE:".cyan);

	request.post({
		url: 'http://stage.gnet.it/rest/api/latest/issue',
		auth: login,
		json: {
	    "fields": {
	        "project":
	        {
	            "key": "TODO"
	        },
	        "summary": req.body.summary,
	        "description": "",
	        "issuetype": {
	            "name": "Task"
	        }
   		}
	}
	}, function(err, res, body){
		if (err) console.log(colors.red("# ERROR: %s"), err);
		else console.log("# status: 201 (created)");
	});
});

router.delete('/delete', parseUrlencoded, function(req, res){
	++count;
	console.log("\n# ID "+count);
    console.log("# REQUEST:".cyan);
	console.log("# type: DELETE(delete)");
    console.log("# url: "+req.headers.host+req.originalUrl);
	console.log("# key: "+req.body.key);
	console.log("# RESPONSE:".cyan);

	request.delete({
		url: 'http://stage.gnet.it/rest/api/latest/issue/'+req.body.key,
	    auth: login
	}, function (err, res, body){
		if (err) console.log(colors.red("# ERROR: %s"), err);
		else console.log("# status: 200 (deleted)");
	});
});

module.exports = router;
