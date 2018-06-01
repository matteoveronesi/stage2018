$(document).ready(function(){
    $("#content-table").load("/issues");

    $(".show-add").click(function(){
        $("#iadd").toggle(100);
    });
    $("#load").click(function(){
        $("#content-table").load("/issues");
    });

    $("#new-add").click(function(){
        //var key = $("#new-key");
        var summary = $("#new-name");
        var status = "Todo";

        if(/*key.val().length > 0 && */summary.val().length > 0){
            $.ajax({
            	type: "POST",
                url: "/new",
                data: {/*"key": key.val(),*/"summary": summary.val(),"status": status}
            }).done(
                //alert("Richiesta effettuata.\n\ntype: POST\nquery: (add)"));
                alert(response));

            $("#iadd").toggle(100);
            //key.prop("value", "");
            summary.prop("value", "");
        }
        else alert("Controlla i dati inseriti.");
    });
});

function status(n){
    var status = $("#"+n).find(".td-status").find("i");

    if (status.text() === "check_box")
        status.text("check_box_outline_blank");
    else
        status.text("check_box");
}

function edit(n){
    var obj = $("#"+n);
    var key = obj.find(".td-key").find("a");
    var summary = obj.find(".td-name").find("input");
    var status = obj.find(".td-status").find("i");
    var status_name = "";

    if (status.text() === "check_box")
        status_name = "Done";
    else
        status_name = "Todo";

    if(summary.val().length > 0){
      	$.ajax({
      	     type: "PUT",
             url: "/"+n,
             data: {"key": key.text(),"summary": summary.val(),"status": status_name}
      	}).done(alert("Richiesta effettuata.\n\ntype: PUT\nquery: (edit)"));

        summary.prop("value", "");
    }
    else alert("Controlla i dati inseriti.");
}

function del(n){
    var key = $("#"+n).find(".td-key").find("a").text();
    $.ajax({
         type: "DELETE",
         url: "/"+n,
         data: {"key": key}
    }).done(/*alert("Richiesta effettuata.\n\ntype: DELETE\nquery: (delete)")*/);
}
