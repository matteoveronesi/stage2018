$(document).ready(function(){

    if(localStorage.getItem("user")) $(".login-page").toggle();

    getUserData();

    $(".show-add").click(function(){
        $("#iadd").toggle(100);
        $("#iadd").find("#new-name").focus();
    });

    $(".show-menu").click(function(){
        $(".sidebar-focus").toggle();
    });

    $("#load").click(function(){
        refresh(1,1);
    });

    $("#login_done").click(function(){
        setUserData();
    });

    $(".logout").click(function(){
        deleteUserData();
    });

    $("#new-add").click(function(){
        addIssue();
    });
});

function refresh(sec,opt){
    $("#logo").prop("src", "spin.svg");
    var user = localStorage.getItem("user");
    var pass = localStorage.getItem("pass");
    var host = localStorage.getItem("host");
    var projects = localStorage.getItem("projects");
    var projectsName = localStorage.getItem("projectsName");

    if (opt == 1)
        $.ajax({
            type: "POST",
            url: "/rest/projects",
            data: {
                "user": user,
                "pass": pass,
                "host": host,
                "projects": projects,
                "projectsName": projectsName
            },
            success: function(res){
                $("#content-table").html(res);
            },
            error: function(err){
                console.log(err);
            }
        });
    else if (opt == 2)
        setTimeout(()=>$.ajax({
            type: "POST",
            url: "/rest/projects",
            data: {
                "user": user,
                "pass": pass,
                "host": host,
                "projects": projects,
                "projectsName": projectsName
            },
            success: function(res){
                $("#content-table").html(res);
            },
            error: function(err){
                console.log(err);
            }
        }), 1100);
    setTimeout(()=>$("#logo").prop("src", "logo.png"), sec*1100);
}

function getUserData(){
    if (typeof(Storage) !== "undefined") {
        // Store
        //localStorage.setItem("username", "Smoth");
        // Retrieve
        //res = [ utente, nome completo, host]
        var user = localStorage.getItem("user");
        if (user){
            var name = localStorage.getItem("name");
            var pass = localStorage.getItem("pass");
            var host = localStorage.getItem("host");
            $(".user_avatar").prop("src", host+"/secure/useravatar?ownerId="+user);
            $(".user_avatar").prop("class", "user_avatar w3-circle");
            $(".user_profile").prop("href", host+"/secure/ViewProfile.jspa");
            $(".user_name").text(name);
            $(".login").toggle();
            $(".logout").toggle();
            refresh(1,1);
        }
    }
}

function setUserData(){
    var user = $("#login_user").val();
    var pass = $("#login_pass").val();
    var host = $("#login_host").val();

    if (user.length > 0 && pass.length > 0 && host.length > 0){
        $.ajax({
            type: "POST",
            url: "/rest/login",
            data: {"user": user, "pass": pass, "host": host},
            success: function(res){ //res = { nome utente, key progetti, nome progetti }
                $("#login_user").val("");
                $("#login_pass").val("");
                $("#login_host").val("");
                $(".login-page").toggle();

                localStorage.setItem("projects", JSON.stringify(res.projects));
                localStorage.setItem("projectsName",  JSON.stringify(res.projectsName));
                localStorage.setItem("user", user);
                localStorage.setItem("name", res.name);
                localStorage.setItem("pass", pass);
                localStorage.setItem("host", host);
                location.reload();
            },
            error: function(err){
                console.log(err);
                alert("Qualcosa non ha funzionato.");
            }
        });
    }
    else alert("Compila tutti i campi.");
}

function deleteUserData() {
    localStorage.removeItem("user");
    localStorage.removeItem("name");
    localStorage.removeItem("pass");
    localStorage.removeItem("host");
    localStorage.removeItem("projects");
    localStorage.removeItem("projectsName");

    $(".user_avatar").prop("src","guest.svg");
    $(".user_avatar").prop("class","user_avatar");
    $(".user_name").text("Accesso non effettuato.");
    $(".user_profile").prop("href","");
    $("#content-table").html("");
    $(".login-page").toggle();
    $(".login").toggle();
    $(".logout").toggle();
}

function addIssue() {
    var key = $("#new-key");
    var summary = $("#new-name");
    var status = "Todo";
    var user = localStorage.getItem("user");
    var pass = localStorage.getItem("pass");
    var host = localStorage.getItem("host");

    if(key.val().length > 0 && summary.val().length > 0){
        $.ajax({
            type: "POST",
            url: "/rest/add",
            data: {"user": user, "pass": pass, "host": host, "key": key.val(),"summary": summary.val(),"status": status},
            success: function(res){
                console.log(res);
                refresh(2,2);
            },
            error: function(err){
                console.log(err);
            }
        });

        $("#iadd").toggle(100);
        //key.prop("value", "");
        summary.prop("value", "");
    }
    else{
    }
}

function toggleProject(start,end,project){
    if ($('#'+start).css("display") == "none")
        $("#"+project).css("transform","rotate(90deg)");
    else
        $("#"+project).css("transform","rotate(360deg)");
    for (var n = start; n < end; n++)
        $("#"+n).toggle();
}

function status(n){
    var obj = $("#"+n);
    var key = obj.find(".td-key").find("a");
    var status = obj.find(".td-status").find("i");
    var status_value = "";
    var user = localStorage.getItem("user");
    var pass = localStorage.getItem("pass");
    var host = localStorage.getItem("host");

    if (status.text() === "check_box"){
        status_value = "51"; //todo
        status.text("check_box_outline_blank");
    }
    else{
        status_value = "21"; //done
        status.text("check_box");
    }

    $.ajax({
        type: "POST",
         url: "/rest/edit/status",
         data: {"user": user, "pass": pass, "host": host, "key": key.text(), "status": status_value},
         success: function(res){
             console.log(res);
             refresh(2);
         },
         error: function(err){
             console.log(err);
         }
	});
}

function show(n){
    $("#"+n).find(".edit").css("display","inline");
}

function hide(n){
    setTimeout(()=>$("#"+n).find(".edit").css("display","none"),150);
}

function editFromKey(key,n){
    if (key == 13)
        $("#"+n).find(".td-name").find("input").blur();

}

function edit(n){
    var obj = $("#"+n);
    var key = obj.find(".td-key").find("a");
    var summary = obj.find(".td-name").find("input");
    var user = localStorage.getItem("user");
    var pass = localStorage.getItem("pass");
    var host = localStorage.getItem("host");

    if(summary.val().length > 0 && summary.val() != summary.prop("placeholder")){
      	$.ajax({
      	     type: "PUT",
             url: "/rest/edit/summary",
             data: {"user": user, "pass": pass, "host": host, "key": key.text(), "summary": summary.val()},
             success: function(res){
                 console.log(res);
                 refresh(2,2);
             },
             error: function(err){
                 console.log(err);
             }
      	});
        $("#"+n).find(".edit").css("display","inline");
    }
    else{
    }
}

function del(n){
    var key = $("#"+n).find(".td-key").find("a").text();
    var user = localStorage.getItem("user");
    var pass = localStorage.getItem("pass");
    var host = localStorage.getItem("host");

    $.ajax({
         type: "DELETE",
         url: "/rest/delete",
         data: {"user": user, "pass": pass, "host": host, "key": key},
         success: function(res){
             console.log(res);
             refresh(2,2);
         },
         error: function(err){
             console.log(err);
         }
    });
}
