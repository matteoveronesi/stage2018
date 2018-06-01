$(document).ready(function(){
    refresh(1);
    
    $(".show-add").click(function(){
        $("#iadd").toggle(100);
    });

    $("#load").click(function(){
        refresh(1);
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
            }).done(refresh(2));

            $("#iadd").toggle(100);
            //key.prop("value", "");
            summary.prop("value", "");
        }
        else alert("Controlla i dati inseriti.");
    });
});

function refresh(i){
    $("#logo").prop("src", "spin.svg");
    $("#content-table").load("/rest/issues");
    setTimeout(function(){$("#logo").prop("src", "logo.png");
    }, i*1000);
}

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
        status_name = "21"; //done
    else
        status_name = "51"; //todo

    if(summary.val().length > 0 && summary.val() != summary.prop("placeholder")){
      	$.ajax({
      	     type: "PUT",
             url: "/rest/edit",
             data: {"key": key.text(),"summary": summary.val(),"status": status_name}
      	}).done(refresh(2));

    }
    else alert("Controlla i dati inseriti.");
}

function del(n){
    var key = $("#"+n).find(".td-key").find("a").text();
    $.ajax({
         type: "DELETE",
         url: "/rest/delete",
         data: {"key": key}
    }).done(refresh(2));
}
