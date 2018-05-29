$(document).ready(function(){
    $("#content-table").load("/issues");

    $(".show-add").click(function(){
        $("#iadd").toggle(100);
    });

    $("#new-add").click(function(){
        var key = $("#new-key").val();
        var summary = $("#new-name").val();
        var status = "Todo";

        if(key.length > 0 && summary.length > 0){
            	$.ajax({
            	     type: "POST",
                   url: "/new",
                   data: {"key": key,"summary": summary,"status": status}
            	}).done(alert("Richiesta effettuata.\n\ntype: POST\nquery: (add)"));

              $("#iadd").toggle(100);
              $("#new-key").prop("value", "");
              $("#new-name").prop("value", "");
        }
        //else alert("Controlla i dati inseriti.");
    });
});

function edit(n){
    $("#"+n).find(".td-key").find("input").prop("disabled", false);
    $("#"+n).find(".td-name").find("input").prop("disabled", false);
    var key = $("#"+n).find(".td-key").find("input").val();
    var summary = $("#"+n).find(".td-name").find("input").val();
    var status = $("#"+n).find(".td-status").text();

    if(key.length > 0 && summary.length > 0 && status.length > 0){
      	$.ajax({
      	     type: "POST",
             url: "/"+n,
             data: {"key": key,"summary": summary,"status": status}
      	}).done(alert("Richiesta effettuata.\n\ntype: POST\nquery: (edit)"));
        $("#"+n).find(".td-key").find("input").prop("disabled", true);
        $("#"+n).find(".td-name").find("input").prop("disabled", true);
        $("#"+n).find(".td-key").find("input").prop("value", "");
        $("#"+n).find(".td-name").find("input").prop("value", "");
    }
    //else alert("Controlla i dati inseriti.");
}

function del(n){
    var key = $("#"+n).find(".td-key").find("input").prop("placeholder");
    $.ajax({
         type: "DELETE",
         url: "/"+n,
         data: {"key": key}
    }).done(alert("Richiesta effettuata.\n\ntype: DELETE\nquery: (delete)"));
}
