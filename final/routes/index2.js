const express = require("express");
const parser = require("body-parser");
const request = require("request");
const colors = require("colors");
const router = express.Router();
const encoded = parser.urlencoded({ extended: false });

var tableData; //JSON delle issue del progetto
var tableToString; //html di output delle issue

/* DATI UTENTE */
var login = {"user": "99mv66", "pass": "stage.2018"};
var host = "http://stage.gnet.it";
var rest = "/rest/api/latest";
var project = "TODO";

function getTime(){
	return new Date().toLocaleTimeString();
}

function extractIssues(){
	tableToString = "";

	for (var i = 0; i < tableData.total; i++){
		tableToString += '<tr id="'+i+'">';
		tableToString += '<td title="Cambia Status" onclick="status('+i+')" class="td-status"><i class="material-icons">';
		if (tableData.issues[i].fields.status.name === "To Do")
			tableToString += 'check_box_outline_blank';
		else
			tableToString += 'check_box';
		tableToString += '</i></td>';
		tableToString += '<td title="Vedi Issue" class="td-key w3-white w3-small"><p><a href="http://stage.gnet.it/browse/'+tableData.issues[i].key+'" target="_blank">'+tableData.issues[i].key+'</a></p></td>';
		tableToString += '<td title="Cambia Nome" class="td-name"><input onblur="hide('+i+')" onfocus="show('+i+')" class="w3-input input" type="text" placeholder="'+tableData.issues[i].fields.summary+'" value="'+tableData.issues[i].fields.summary+'"></td>';
		tableToString += '<td class="icons"><i title="Conferma" onclick="edit('+i+')" class="material-icons edit">mode_edit</i> <i title="Elimina" onclick="del('+i+')" class="material-icons">delete</i></td>';
		tableToString += '</tr>';
	}

	return tableToString;
}

function callJira(dest, type, data){
    return new Promise( function (resolve, reject) {
        request({
            url: dest,
            method: type,
            auth: login,
            json: data
        }, function (err, res, body){
            if (err)
                reject(" ERROR: " + err);
            else{
                if (type == "GET")
					tableData = JSON.parse(body);
                resolve(body);
            }
        });
    });
}

router.all('/issues', function (req, res, next) {
	if(req.headers.host == "localhost:8080") next();
	else res.send("<h1>401 Unauthorized</h1><h3>Permessi insufficenti.</h3>");
})
router.all('/add', function (req, res, next) {
	if(req.headers.host == "localhost:8080") next();
})

router.get("/issues", function(req, res){
	console.log("\n(" + getTime() + ")");
    console.log(" REQUEST:".cyan);
	console.log(" type: GET(load)");
    console.log(" url: " + req.headers.host + req.originalUrl);
	console.log(" RESPONSE:".cyan);

    var dest = host + rest + "/search?jql=project=" + project + "&maxResults=200";

	callJira(dest, "GET").then(function (output){
		res.send(extractIssues());
		console.log(" status: 200 (sent)");
			console.log(tableToString);
	}).catch(function (output) {
		console.log(colors.red(output));
	});

});

router.post("/edit/status", encoded, function(req, res){
	console.log("\n(" + getTime() + ")");
    console.log(" REQUEST:".cyan);
	console.log(" type: POST(edit status)");
    console.log(" url: " + req.headers.host + req.originalUrl);
    console.log(" key: " + req.body.key);
    console.log(" status: " + req.body.status);
	console.log(" RESPONSE:".cyan);

    var dest = host + rest + "/issue/" + req.body.key + "/transitions";
    var data = {
        "transition": {
                    "id": req.body.status
        }
    };

    callJira(dest, "POST", data).then(function (output){
		console.log(" status: 200 (sent)");
	}).catch(function (output) {
		console.log(colors.red(output));
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

    var dest = host + rest + "/issue/" + req.body.key;
    var data = {
        "fields": {
            "summary": req.body.summary
        }
    };

    callJira(dest, "PUT", data).then(function (output){
		console.log(" status: 200 (sent)");
	}).catch(function (output) {
		console.log(colors.red(output));
	});
});

router.post("/add", encoded, function(req, res){
	console.log("\n(" + getTime() + ")");
    console.log(" REQUEST:".cyan);
	console.log(" type: POST(add)");
    console.log(" url: " + req.headers.host + req.originalUrl);
    console.log(" summary: " + req.body.summary);
	console.log(" RESPONSE:".cyan);

    var dest = host + rest + "/issue";
    var data = {
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
    };

    callJira(dest, "POST", data).then(function (output){
		console.log(" status: 200 (sent)");
	}).catch(function (output) {
		console.log(colors.red(output));
	});
});

router.delete("/delete", encoded, function(req, res){
	console.log("\n(" + getTime() + ")");
    console.log(" REQUEST:".cyan);
	console.log(" type: DELETE(delete)");
    console.log(" url: " + req.headers.host + req.originalUrl);
	console.log(" key: " + req.body.key);
	console.log(" RESPONSE:".cyan);

    var dest = host + rest + "/issue/" + req.body.key;

    callJira(dest, "DELETE").then(function (output){
		console.log(" status: 200 (sent)");
	}).catch(function (output) {
		console.log(colors.red(output));
	});
});

module.exports = router;
