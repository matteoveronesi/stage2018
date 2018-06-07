$(document).ready(function(){
    refresh(1,1);

    $.ajax({
        type: "GET",
        url: "/rest/userdata",
        success: function(res){
            $(".user_avatar").prop("src","http://stage.gnet.it/secure/useravatar?ownerId="+res[0]);
            $(".user_avatar").prop("class","user_avatar w3-circle");
            $(".user_name").text(res[1]);
            $(".login").toggle();
            $(".logout").toggle();
        },
        error: function(err){
            console.log(err);
        }
    });

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

    $(".logout").click(function(){
        $(".user_avatar").prop("src","guest_dark.svg");
        $(".avatar_small").prop("src","guest.svg");
        $(".user_avatar").prop("class","user_avatar");
        $(".user_name").text("Accesso non effettuato.");
        $.ajax({
            type: "GET",
            url: "/rest/logout",
            success: function(res){
                console.log(res);
            },
            error: function(){
                console.log(err);
            }
        });
        $("#content-table").html("");
        $(".login").toggle();
        $(".logout").toggle();
    });

    $("#login_done").click(function(){
        var user = $("#login_user").val();
        var pass = $("#login_pass").val();
        var host = $("#login_host").val();

        if (user.length > 0 && pass.length > 0 && host.length > 0){
            $.ajax({
            	type: "POST",
                url: "/rest/login",
                data: {"user": user, "pass": pass, "host": host},
                success: function(res){
                    $("#login_user").val("");
                    $("#login_pass").val("");
                    $("#login_host").val("");
                    location.reload();
                },
                error: function(){
                    alert("I dati inseriti non sono corretti.");
                }
            });
        }
        else alert("aghh");

    });

    $("#new-add").click(function(){
        var key = $("#new-key");
        var summary = $("#new-name");
        var status = "Todo";

        if(key.val().length > 0 && summary.val().length > 0){
            $.ajax({
            	type: "POST",
                url: "/rest/add",
                data: {"key": key.val(),"summary": summary.val(),"status": status},
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
    });
});

function refresh(sec,opt){
    $("#logo").prop("src", "spin.svg");
    if (opt == 1)
        $("#content-table").load("/rest/projects");
    else if (opt == 2)
        setTimeout(function(){$("#content-table").load("/rest/projects")}, 1100);
    setTimeout(function(){$("#logo").prop("src", "logo.png")}, sec*1100);
}

function toggleProject(start,end){
    for (var n = start; n < end; n++) $("#"+n).toggle();
}

function status(n){
    var obj = $("#"+n);
    var key = obj.find(".td-key").find("a");
    var status = obj.find(".td-status").find("i");
    var status_value = "";

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
         data: {"key": key.text(),"status": status_value},
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

function edit(n){
    var obj = $("#"+n);
    var key = obj.find(".td-key").find("a");
    var summary = obj.find(".td-name").find("input");

    if(summary.val().length > 0 && summary.val() != summary.prop("placeholder")){
      	$.ajax({
      	     type: "PUT",
             url: "/rest/edit/summary",
             data: {"key": key.text(),"summary": summary.val()},
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
    $.ajax({
         type: "DELETE",
         url: "/rest/delete",
         data: {"key": key},
         success: function(res){
             console.log(res);
             refresh(2,2);
         },
         error: function(err){
             console.log(err);
         }
    });
}
