const express = require("express");
const parser = require("body-parser");
const request = require("request");
const colors = require("colors");
const router = express.Router();
const URL = parser.urlencoded({ extended: false });

var tableData; //JSON delle issue del progetto
var tableToString; //html di body delle issue
var rest = "/rest/api/latest"; //api rest di jira

function getTime(){
	return new Date().toLocaleTimeString();
}

function extractProjectsIssues(login, host, projects, projectsName){
	tableToString = "";
	var c = 0;
	return new Promise( function (resolve, reject) {
		projects.forEach(function(p,j){
			var dest = host + rest + "/search?jql=project=" + p + "&maxResults=200";

			callJira(login, dest, "GET").then(function (body){
				for (var i = 0; i < tableData.total; i++,c++){
					var max = c + tableData.total +1;
					if (i == 0){
						var cp = c+1;
						tableToString += '<tr id="'+p+'" name="'+projectsName[j]+'" onclick="toggleProject('+cp+','+max+','+c+')"><td colspan="3"><h6><img src="arrow.svg" id="'+c+'" height="10px"> '+projectsName[j]+' ('+p+')</h6></td></tr>';
						++c;
					}
					tableToString += '<tr id="'+c+'">';
					tableToString += '<td title="Cambia Status" onclick="status('+c+')" class="td-status"><i class="material-icons">';
					if (tableData.issues[i].fields.status.name === "To Do")
						tableToString += 'check_box_outline_blank';
					else
						tableToString += 'check_box';
					tableToString += '</i></td>';
					tableToString += '<td title="Vedi Issue" class="td-key w3-white w3-small"><p><a href="'+host+'/browse/'+tableData.issues[i].key+'" target="_blank">'+tableData.issues[i].key+'</a></p></td>';
					tableToString += '<td title="Cambia Nome" class="td-name"><input onkeydown="editFromKey(event.which,'+c+')" onblur="edit('+c+')" class="w3-input input" type="text" placeholder="'+tableData.issues[i].fields.summary+'" value="'+tableData.issues[i].fields.summary+'"></td>';
					tableToString += '<td class="icons"><i title="Elimina" onclick="del('+c+')" class="material-icons">delete</i></td>';
					tableToString += '</tr>';
					// <i title="Conferma" onclick="edit('+c+')" class="material-icons edit">mode_edit</i>

				}
				if (++j == projects.length) resolve("ok");
				console.log(" status: " + p + " fatto.");
			}).catch(function (body) {
				console.log(colors.red(body));
				reject("error");
			});
		});
	});
}

function callJira(login, dest, type, data){
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
                if (type == "GET"){
					try{
				        tableData = JSON.parse(body);
				    }
				    catch (e){
				        body = "denied";
				    }
				}
				resolve(body);
            }
        });
    });
}

router.post("/login", URL, function(req, res){
	console.log("\n(" + getTime() + ")");
    console.log(" REQUEST:".cyan);
	console.log(" type: POST(login)");
    console.log(" url: " + req.headers.host + req.originalUrl);
    console.log(" host: " + req.body.host);
    console.log(" user: " + req.body.user);
    console.log(" pass: " + req.body.pass);
	console.log(" RESPONSE:".cyan);

	var login = {"user": req.body.user,"pass": req.body.pass};
    var dest = req.body.host + rest + "/project";
	var projects = [];
	var projectsName = [];
	callJira(login, dest, "GET").then(function (body){
		if (body == "denied")
			res.sendStatus(400);
		else{
			JSON.parse(body).forEach(function(p,i){
				projects.push(p.key);
				projectsName.push(p.name);

				if (++i == JSON.parse(body).length){
					var dest = req.body.host + "/rest/api/latest/user?username=" + login.user;

					callJira(login, dest, "GET").then(function (body){
						res.send({"projects": projects, "projectsName": projectsName, "name": JSON.parse(body).displayName});
					}).catch(function (body) {
						console.log(colors.red(body));
					});
				}
			});
		}
		console.log(" status: 200 (sent)");
	}).catch(function (body) {
		console.log(colors.red(body));
	});
});

router.post("/projects", URL, function(req, res){
	console.log("\n(" + getTime() + ")");
    console.log(" REQUEST:".cyan);
	console.log(" type: GET(projects)");
    console.log(" url: " + req.headers.host + req.originalUrl);
	console.log(" RESPONSE:".cyan);

	var login = {"user": req.body.user,"pass": req.body.pass};

	extractProjectsIssues(login, req.body.host, JSON.parse(req.body.projects), JSON.parse(req.body.projectsName)).then(function (body){
		res.send(tableToString);
		console.log(" status: 200 (sent projects)");
	}).catch(function (body) {
		console.log(colors.red(body));
	});
});

router.post("/edit/status", URL, function(req, res){
	console.log("\n(" + getTime() + ")");
    console.log(" REQUEST:".cyan);
	console.log(" type: POST(edit status)");
    console.log(" url: " + req.headers.host + req.originalUrl);
    console.log(" key: " + req.body.key);
    console.log(" status: " + req.body.status);
	console.log(" RESPONSE:".cyan);

	var login = {"user": req.body.user,"pass": req.body.pass};
    var dest = req.body.host + rest + "/issue/" + req.body.key + "/transitions";
    var data = {
        "transition": {
                    "id": req.body.status
        }
    };

    callJira(login, dest, "POST", data).then(function (body){
		console.log(" status: 200 (sent)");
		res.send("fatto");
	}).catch(function (body) {
		console.log(colors.red(body));
		res.send("errore");
	});
});

router.put("/edit/summary", URL, function(req, res){
	console.log("\n(" + getTime() + ")");
    console.log(" REQUEST:".cyan);
	console.log(" type: PUT(edit summary)");
	console.log(" url: " + req.headers.host + req.originalUrl);
    console.log(" key: " + req.body.key);
    console.log(" summary: " + req.body.summary);
	console.log(" RESPONSE:".cyan);

	var login = {"user": req.body.user,"pass": req.body.pass};
    var dest = req.body.host + rest + "/issue/" + req.body.key;
    var data = {
        "fields": {
            "summary": req.body.summary
        }
    };

    callJira(login, dest, "PUT", data).then(function (body){
		console.log(" status: 200 (sent)");
		res.send("fatto");
	}).catch(function (body) {
		console.log(colors.red(body));
		res.send("errore");
	});
});

router.post("/add", URL, function(req, res){
	console.log("\n(" + getTime() + ")");
    console.log(" REQUEST:".cyan);
	console.log(" type: POST(add)");
    console.log(" url: " + req.headers.host + req.originalUrl);
    console.log(" key: " + req.body.key);
    console.log(" summary: " + req.body.summary);
	console.log(" RESPONSE:".cyan);

	var login = {"user": req.body.user,"pass": req.body.pass};
    var dest = req.body.host + rest + "/issue";
    var data = {
        "fields": {
            "project":
            {
                "key": req.body.key
            },
            "summary": req.body.summary,
            "description": "",
            "issuetype": {
                "name": "Task"
            }
        }
    };

    callJira(login, dest, "POST", data).then(function (body){
		console.log(" status: 200 (sent)");
		res.send("fatto");
	}).catch(function (body) {
		console.log(colors.red(body));
		res.send("errore");
	});
});

router.delete("/delete", URL, function(req, res){
	console.log("\n(" + getTime() + ")");
    console.log(" REQUEST:".cyan);
	console.log(" type: DELETE(delete)");
    console.log(" url: " + req.headers.host + req.originalUrl);
	console.log(" key: " + req.body.key);
	console.log(" RESPONSE:".cyan);

	var login = {"user": req.body.user,"pass": req.body.pass};
    var dest = req.body.host + rest + "/issue/" + req.body.key;

    callJira(login, dest, "DELETE").then(function (body){
		console.log(" status: 200 (sent)");
		res.send("fatto");
	}).catch(function (body) {
		console.log(colors.red(body));
		res.send("errore");
	});
});

module.exports = router;
