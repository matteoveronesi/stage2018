$(document).ready(function(){

    if(localStorage.getItem("user")) $(".login-page").toggle();

    getUserData();

    $(".exit-new-issue").click(function(){
        $(".new-issue-focus").hide(10);
    });

    $(".save-status").click(function(){
        saveStatusAlias();
    });

    $(".exit-sidebar").click(function(){
        $(".sidebar-focus").hide(10);
    });

    $(".show-menu").click(function(){
        $(".sidebar-focus").toggle();
    });

    $("#load").click(function(){
        lock(1200);
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

    $(".filter").click(function(){
        $(".filterIssues").toggle();
    });
});

function lock(n){
    $("#lock").show();
    var sec;
    if (n) sec = n;
    else sec = 2500; 
    setTimeout(()=>$("#lock").hide(),sec);
}

function saveStatusAlias(){
    var todo = $("#alias-todo").val();
    var done = $("#alias-done").val();

    localStorage.setItem("todo", todo);
    localStorage.setItem("done", done);

    showToast(1,"Status salvati");
    refresh(1,1);
}

function showToast(n,mex) {
    if (n == 0) var toast = $("#errormex");
    else if (n == 1) var toast = $("#successmex");

    toast.text(mex);
    toast.fadeIn(400);
    setTimeout(()=>toast.fadeOut(1000), 3000);
}

function openAdd(i){
    var projects = localStorage.getItem("projects");
    var project = JSON.parse(projects)[i];

    $("#selectedProject span").text(project);
    $("#new-key").prop("value",project);
    $(".new-issue-focus").show(10);
    $("#iadd").find("#new-name").focus();
}

function refresh(sec,opt){
    $("#logo").prop("src", "spin.svg");
    var user = localStorage.getItem("user");
    var pass = localStorage.getItem("pass");
    var host = localStorage.getItem("host");
    var done = localStorage.getItem("done");
    var projects = localStorage.getItem("projects");
    var table = $("#content-table");
    
    if (done) var statusDone = done;
    else var statusDone = "";

    //var list = $(".status-settings");
    //var projectStatusTodo = [];
    //var projectStatusDone = [];

    if (opt == 1)
        $.ajax({
            type: "POST",
            url: "/rest/projects",
            data: {
                "user": user,
                "pass": pass,
                "host": host,
                "projects": projects,
                "statusDone": statusDone
            },
            success: function(res){
                table.html(res);
                /*
                list.html("<h6>Impostazioni Status</h6>");
                JSON.parse(projects).forEach(function(p,i){
                    list.html(list.html()+'<p class="legend">Project: '+p+'</p><input type="text" placeholder="Status alias Todo"><br><input type="text" placeholder="Status alias Done"><br>');
                });*/
            },
            error: function(err){
                console.log(err);
                showToast(0,"Errore");
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
                "statusDone": statusDone
            },
            success: function(res){
                table.html(res);
            },
            error: function(err){
                console.log(err);
                showToast(0,"Errore");
            }
        }), 1100);
    setTimeout(()=>$("#logo").prop("src", "logo.png"), sec*1200);
}

function getUserData(){
    if (typeof(Storage) !== "undefined") {
        //res = [ utente, nome completo, host]
        var user = localStorage.getItem("user");
        if (user){
            var name = localStorage.getItem("name");
            var host = localStorage.getItem("host");
            var todo = localStorage.getItem("todo");
            var done = localStorage.getItem("done");

            $(".user_avatar").prop("src", host+"/secure/useravatar?ownerId="+user);
            $(".user_avatar").prop("class", "user_avatar w3-circle");
            $(".user_profile").prop("href", host+"/secure/ViewProfile.jspa");
            $(".user_name").text(name);
            $("#alias-todo").val(todo);
            $("#alias-done").val(done);
            $(".login").toggle();
            refresh(1,1);
        }
    }
    else 
        showToast(0,"Spiacenti, il browser non è supportato");
}

function setUserData(){
    var user = $("#login_user").val();
    var pass = $("#login_pass").val();
    var host = $("#login_host").val();
    var projectsList = $("#login_projects").val();
    var projects = projectsList.split(" ");

    if (user.length > 0 && pass.length > 0 && host.length > 0 && projectsList.length > 0){
        $.ajax({
            type: "POST",
            url: "/rest/login",
            data: {"user": user, "pass": pass, "host": host},
            success: function(res){ //res = nome utente
                $("#login_user").val("");
                $("#login_pass").val("");
                $(".login-page").toggle();
                
                localStorage.setItem("projects", JSON.stringify(projects));
                localStorage.setItem("user", user);
                localStorage.setItem("name", res);
                localStorage.setItem("pass", pass);
                localStorage.setItem("host", host);
                location.reload();
            },
            error: function(err){
                console.log(err);
                showToast(0,"Errore");
            }
        });
    }
    //else showToast(0,"Compila tutti i campi.");
}

function deleteUserData() {
    localStorage.removeItem("user");
    localStorage.removeItem("name");
    localStorage.removeItem("pass");
    localStorage.removeItem("host");
    localStorage.removeItem("projects");

    $(".user_avatar").prop("src","guest.svg");
    $(".user_avatar").prop("class","user_avatar");
    $(".user_name").text("Accesso non effettuato.");
    $(".user_profile").prop("href","");
    $("#content-table").html("");
    $(".login-page").toggle();
    $(".login").toggle();
}

function addIssue() {
    var key = $("#new-key");
    var summary = $("#new-name");
    var status = "Todo";
    var user = localStorage.getItem("user");
    var pass = localStorage.getItem("pass");
    var host = localStorage.getItem("host");

    if(key.val().length > 0 && summary.val().length > 0){
        lock();

        $.ajax({
            type: "POST",
            url: "/rest/add",
            data: {"user": user, "pass": pass, "host": host, "key": key.val(),"summary": summary.val(),"status": status},
            success: function(res){
                console.log(res);
                refresh(2,2);
                showToast(1,"Issue aggiunta");
            },
            error: function(err){
                console.log(err);
                showToast(0,"Errore");
            }
        });

        //key.prop("value", "");
        summary.prop("value", "");
    }
    //else showToast(0,"Titolo obbligatorio.");
    
    summary.focus();
}

function toggleProject(start,end,project){
    if ($('#'+start).css("display") == "none"){
        $("#"+project).css("transform","rotate(90deg)");
    }
    else{
        $("#"+project).css("transform","rotate(360deg)");
    }
    for (var n = start; n < end; n++)
        $("#"+n).toggle();
}

function filterIssues(n){
    if (n == 0){
        $("tr").show();
    }
    else if (n == 1){
        $("tr").show();
        $("#content-table tr").filter(function() {
            $(this).toggle($(this).html().indexOf(">check_box<") == -1)
        });
    }
    else if (n == 2){
        $("tr").show();
        $("#content-table tr").filter(function() {
            $(this).toggle($(this).html().indexOf(">check_box_outline_blank<") == -1)
        });
    }
}

function status(n){
    var obj = $("#"+n);
    var key = obj.find(".td-key").find("a");
    var status = obj.find(".td-status").find("i");
    var status_name = "";
    var user = localStorage.getItem("user");
    var pass = localStorage.getItem("pass");
    var host = localStorage.getItem("host");
    var todo = localStorage.getItem("todo");
    var done = localStorage.getItem("done");

    if(todo && done)
    {
        lock(); 
        if (status.text() === "check_box"){
            status_name = todo;
            status.text("check_box_outline_blank");
        }
        else{
            status_name = done;
            status.text("check_box");
        }
    
        $.ajax({
            type: "POST",
             url: "/rest/edit/status",
             data: {"user": user, "pass": pass, "host": host, "key": key.text(), "name": status_name},
             success: function(res){
                 console.log(res);
                 refresh(2);
                 showToast(1,key.text()+" aggiornata");
             },
             error: function(err){
                 console.log(err);
                 showToast(0,"Errore");
             }
        });
    }
    else{
        showToast(0,"Status non trovati");
        setTimeout(()=>showToast(1,"Clicca la rotella per impostarli"),2000);
    }
        

}

/*
function show(n){
    $("#"+n).find(".edit").css("display","inline");
}

function hide(n){
    setTimeout(()=>$("#"+n).find(".edit").css("display","none"),150);
}
*/

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
        lock();

      	$.ajax({
      	     type: "PUT",
             url: "/rest/edit/summary",
             data: {"user": user, "pass": pass, "host": host, "key": key.text(), "summary": summary.val()},
             success: function(res){
                 console.log(res);
                 refresh(2,2);
                 showToast(1,key.text()+" aggiornata");
             },
             error: function(err){
                 console.log(err);
                 showToast(0,"Errore");
             }
      	});
        //$("#"+n).find(".edit").css("display","inline");
    }
    else{}
}

function del(n){
    lock(); 
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
             showToast(1,key+" Eliminata");
         },
         error: function(err){
             console.log(err);
             showToast(0,"Errore");
         }
    });
}
