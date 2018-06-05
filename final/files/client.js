$(document).ready(function(){
    refresh(1,1);

    $(".show-add").click(function(){
        $("#iadd").toggle(100);
        $("#iadd").find("#new-name").focus();
    });

    $("#load").click(function(){
        refresh(1,1);
    });

    $("#new-add").click(function(){
        //var key = $("#new-key");
        var summary = $("#new-name");
        var status = "Todo";

        if(/*key.val().length > 0 && */summary.val().length > 0){
            $.ajax({
            	type: "POST",
                url: "/rest/add",
                data: {/*"key": key.val(),*/"summary": summary.val(),"status": status}
            }).done(refresh(2,2));

            $("#iadd").toggle(100);
            //key.prop("value", "");
            summary.prop("value", "");
        }
        else alert("[ NUOVA ISSUE ]\nControlla i dati inseriti.");
    });
});

function refresh(sec,opt){
    $("#logo").prop("src", "spin.svg");
    if (opt == 1)
        $("#content-table").load("/rest/issues");
    else if (opt == 2)
        setTimeout(function(){$("#content-table").load("/rest/issues")}, 1100);
    setTimeout(function(){$("#logo").prop("src", "logo.png")}, sec*1100);
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
         data: {"key": key.text(),"status": status_value}
	}).done(/*refresh(2)*/);
}

function show(n){
    $("#"+n).find(".edit").css("display","inline");
}

function hide(n){
    $("#"+n).find(".edit").css("display","none");
}

function edit(n){
    var obj = $("#"+n);
    var key = obj.find(".td-key").find("a");
    var summary = obj.find(".td-name").find("input");

    if(summary.val().length > 0 && summary.val() != summary.prop("placeholder")){
      	$.ajax({
      	     type: "PUT",
             url: "/rest/edit/summary",
             data: {"key": key.text(),"summary": summary.val()}
      	}).done(refresh(2,2));
        $("#"+n).find(".edit").css("display","inline");
    }
    else alert("[ ISSUE "+key.text()+" ]\nControlla i dati inseriti.");
}

function del(n){
    var key = $("#"+n).find(".td-key").find("a").text();
    $.ajax({
         type: "DELETE",
         url: "/rest/delete",
         data: {"key": key}
    }).done(refresh(2,2));
}
