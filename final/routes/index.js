const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
//const jsonFind = require('json-find');
const router = express.Router();
const parseUrlencoded = bodyParser.urlencoded({ extended: false });

var data; //JSON delle issue del progetto
var table; //html di output delle issue

function extractIssues(){
	table = "";
	for (var i = 0; i< data.total; i++){
		//console.log();
		table += '<tr id="'+i+'">';
		table += '<td onclick="status('+i+')" class="td-status "><i class="material-icons icon-padding">';
		if (data.issues[i].fields.status.name === "To Do")
			table += 'check_box_outline_blank';
		else
			table += 'check_box';
		table += '</i></td>';
		table += '<td class="td-key w3-white w3-small"><p><a href="http://stage.gnet.it/browse/'+data.issues[i].key+'" target="_blank">'+data.issues[i].key+'</a></p></td>';
		table += '<td class="td-name"><input class="w3-input  w3-white" type="text" placeholder="'+data.issues[i].fields.summary+'"></td>';
		table += '<td><i onclick="edit('+i+')" class="material-icons icon-padding">mode_edit</i> <i onclick="del('+i+')" class="material-icons">delete</i></td>';
		table += '</tr>';
	}
	return table;
}

//////////////////////////////////////////////////////////

function setData(body){
	data = JSON.parse(body);
}

function getIssues(){
	request.get('http://stage.gnet.it/rest/api/latest/search?jql=project=TODO&maxResults=200', {
	    'auth': {
	        'user': '99mv66',
	        'pass': 'stage.2018'
	    }
	}, function (err, res, body){
	    setData(body);
	});
}
getIssues();
/*
router.all('/', function(req, res, next){
    table = "";
    next();
});
*/
router.get('/', function(req, res){
    console.log("\n# REQUESTED <LOAD> CALL");
	getIssues();
    res.send(extractIssues());
    res.status(200);
});

router.put('/', parseUrlencoded, function(req, res){
    console.log("\n# REQUESTED <EDIT> CALL");
    console.log(
        "# key: "+req.body.key+
        "# summary: "+req.body.summary+
        "\n# status: "+req.body.status
    );

	request.post({
		url: 'http://stage.gnet.it/rest/api/latest/issue/'+req.body.key+'/transitions',
		auth:{
	        'user': '99mv66',
	        'pass': 'stage.2018'
		},
		json: {
			"transition": {
						"id": "21"
			}
		}
	}, function(error, response, body){
		console.log("post: "+error+"\n"+JSON.stringify(body));
	});

	request.put({
		url: 'http://stage.gnet.it/rest/api/latest/issue/'+req.body.key,
		auth:{
	        'user': '99mv66',
	        'pass': 'stage.2018'
		},
		json: {
	    "fields": {
	        "summary": req.body.summary/*,
			"status": {
				"id": "10000"
			}*/
   		}
	}
	}, function(error, response, body){
		console.log("put: "+error);
	});
});

router.post('/', parseUrlencoded, function(req, res){
    console.log("\n# REQUESTED <ADD> CALL");
    console.log(
        //"# key: "+req.body.key+
        "# summary: "+req.body.summary//+
        //"\n# status: "+req.body.status
    );

	request.post({
		url: 'http://stage.gnet.it/rest/api/latest/issue',
		auth:{
	        'user': '99mv66',
	        'pass': 'stage.2018'
		},
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
	}, function(error, response, body){
		console.log(body);
	});

	res.send(extractIssues());
    res.status(200);
});

router.delete('/', parseUrlencoded, function(req, res){
    console.log("\n# REQUESTED <DELETE> CALL");
    //console.log("# key: "+req.body.key);

	request.delete('http://stage.gnet.it/rest/api/latest/issue/'+req.body.key, {
	    'auth': {
	        'user': '99mv66',
	        'pass': 'stage.2018'
	    }
	}, function (err, res, body){
		console.log("error:"+err);
	});
    res.status(200);
});

module.exports = router;
