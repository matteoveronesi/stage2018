const express = require("express");
const parser = require("body-parser");
const request = require("request");
const colors = require("colors");
const jsf = require("jsonfile");
const router = express.Router();
const encoded = parser.urlencoded({ extended: false });

var tableData; //JSON delle issue del progetto
var tableToString; //html di output delle issue

/* DATI UTENTE */
var login;
var host;
var rest = "/rest/api/latest";
var projects = [];
var projectsName = [];

getUserData();

function getTime(){
	return new Date().toLocaleTimeString();
}

function extractProjectsIssues(){
	tableToString = "";
	var c = 0;

	return new Promise( function (resolve, reject) {
		projects.forEach(function(p,j){
			var dest = host + rest + "/search?jql=project=" + p + "&maxResults=200";
			console.log(p);
			callJira(dest, "GET").then(function (output){
				for (var i = 0; i < tableData.total; i++,c++){
					var max = c + tableData.total +1;
					if (i == 0){
						var cp = c+1;
						tableToString += '<tr onclick="toggleProject('+cp+','+max+','+c+')"><td colspan="3"><h6><img src="arrow.svg" id="'+c+'" height="10px"> '+projectsName[j]+' ('+p+')</h6></td></tr>';
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
			}).catch(function (output) {
				console.log(colors.red(output));
				reject("error");
				res.send("errore " + p);
			});
		});
	});
}

function getUserData(){
	jsf.readFile("files/usr.json", function(err, userData){
		if (err)
			console.log(err);
		else{
			login = userData[0];
			host = userData[1].host;
		}
	});
}

function setUserData(host, user, pass){
	jsf.writeFile("files/usr.json", [{
		"user": user,
		"pass": pass
	},{
		"host": host
	}], function (err){
		if (err)
			console.log(err);
	});
	getUserData();
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

router.all("/:name", function (req, res, next) {
	if(req.headers.host == "localhost:8080") next();
	else{
		console.log("\n(" + getTime() + ")");
	    console.log(" UNAUTHORIZED REQUEST.".red);
		res.send("<h1>401 Unauthorized</h1><h3>Permessi insufficenti.</h3>");
	}
})

router.post("/login", encoded, function(req, res){
	console.log("\n(" + getTime() + ")");
    console.log(" REQUEST:".cyan);
	console.log(" type: POST(login)");
    console.log(" url: " + req.headers.host + req.originalUrl);
    console.log(" host: " + req.body.host);
    console.log(" user: " + req.body.user);
    console.log(" pass: " + req.body.pass);
	console.log(" RESPONSE:".cyan);

	setUserData(req.body.host, req.body.user, req.body.pass);
    var dest = req.body.host + rest + "/project";
	callJira(dest, "GET").then(function (output){
		if (output == "denied")
			res.sendStatus(401);
		else
			res.sendStatus(200);

		console.log(" status: 200 (sent)");
	}).catch(function (output) {
		console.log(colors.red(output));
	});
});


router.get("/logout", function(req, res){
	console.log("\n(" + getTime() + ")");
    console.log(" REQUEST:".cyan);
	console.log(" type: GET(logout)");
    console.log(" url: " + req.headers.host + req.originalUrl);
	console.log(" RESPONSE:".cyan);

	setUserData("","","");
	projects = [];
	projectsName = [];
	res.sendStatus(200);
});

router.get("/userdata", function(req, res){
	console.log("\n(" + getTime() + ")");
    console.log(" REQUEST:".cyan);
	console.log(" type: GET(userdata)");
    console.log(" url: " + req.headers.host + req.originalUrl);
	console.log(" RESPONSE:".cyan);

	if (login){
		callJira(host + rest + "/project", "GET").then(function (output){
			projects = [];
			projectsName = [];
			JSON.parse(output).forEach(function(p,i){
				projects.push(p.key);
				projectsName.push(p.name);
			});
			console.log(" PROJECTS: status: 200 (sent)");
		}).catch(function (output) {
			console.log(colors.red(output));
		});

		callJira(host + "/rest/api/latest/user?username=" + login.user, "GET").then(function (output){
			res.send([login.user, JSON.parse(output).displayName,host]);
		}).catch(function (output) {
			console.log(colors.red(output));
		});
		console.log(" USERDATA: status: 200 (sent)");
	}
	else{
		console.log(" ERROR: 401 Unauthorized.".red);
		res.sendStatus(401);
	}
});

router.get("/projects", function(req, res){
	console.log("\n(" + getTime() + ")");
    console.log(" REQUEST:".cyan);
	console.log(" type: GET(projects)");
    console.log(" url: " + req.headers.host + req.originalUrl);
	console.log(" RESPONSE:".cyan);

	if (!login)
		res.send("<tr><td><h3>Accesso non effettuato.</h3></td></tr>");
	else{
		extractProjectsIssues().then(function (output){
			console.log(" status: 200 (sent projects)");
			res.send(tableToString);
		}).catch(function (output) {
			console.log(colors.red(output));
		});
	}
	console.log(" status: 200 (sent)");
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
		res.send("fatto");
	}).catch(function (output) {
		console.log(colors.red(output));
		res.send("errore");
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
		res.send("fatto");
	}).catch(function (output) {
		console.log(colors.red(output));
		res.send("errore");
	});
});

router.post("/add", encoded, function(req, res){
	console.log("\n(" + getTime() + ")");
    console.log(" REQUEST:".cyan);
	console.log(" type: POST(add)");
    console.log(" url: " + req.headers.host + req.originalUrl);
    console.log(" key: " + req.body.key);
    console.log(" summary: " + req.body.summary);
	console.log(" RESPONSE:".cyan);

    var dest = host + rest + "/issue";
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

    callJira(dest, "POST", data).then(function (output){
		console.log(" status: 200 (sent)");
		res.send("fatto");
	}).catch(function (output) {
		console.log(colors.red(output));
		res.send("errore");
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
		res.send("fatto");
	}).catch(function (output) {
		console.log(colors.red(output));
		res.send("errore");
	});
});

module.exports = router;
