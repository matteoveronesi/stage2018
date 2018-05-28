$(document).ready(function(){
    $(".show-add").click(function(){
        $("#iadd").toggle(100);
    });

    $(".edit").click(function(){
      target = $(this);
      alert(JSON.stringify(target));

        $.ajax({
          type: 'POST', url: '/'+this, data: {"key":"","summary":"","status":""}
        });
    });
});
