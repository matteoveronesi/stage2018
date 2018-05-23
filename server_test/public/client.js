$(function(){

  $.get('/cities', appendToList);
  function appendToList(cities) {
    var list = [];
    var content, city;
    for(var i in cities){
      city = cities[i];
      content = '<a href="#" name-city="'+city+'">'+city+'</a> '+
        /*'<a href="#" edit-city="'+city+'">[EDIT]</a>'+*/
        '<a href="#" data-city="'+city+'">[X]</a>';
      list.push($('<li>', { html: content }));
    }
    $('.city-list').append(list);
  }

  $('#add_form').on('submit', function(event) {
    event.preventDefault();
    var form = $(this);
    var cityData = form.serialize();
    $.ajax({
      type: 'POST', url: '/cities', data: cityData
    }).done(function(cityName){
      appendToList([cityName]);
      form.trigger('reset');
    });
  });

  $('#edit_form').on('submit', function(event) {
    event.preventDefault();
    var form = $(this);
    var cityData = form.serialize();
    $.ajax({
      type: 'POST', url: '/cities', data: cityData
    }).done(function(cityName){
      alert(cityName);
      appendToList([cityName] );
      form.trigger('reset');
    });
  });

  $('.city-list').on('click', 'a[data-city]', function(event){
    if (!confirm('Eliminare?')) {
      return false;
    }
    var target = $(event.target);
    $.ajax({
      type: 'DELETE', url: '/cities/' + target.data('city')
    }).done(function() {
      target.parents('li').remove();
    });
  });

  $('.city-list').on('click', 'a[name-city]', function(event){
    if (!confirm('Modificare?')) {
      return false;
    }
    var target = $(event.target);
    $.ajax({
      type: 'POST', url: '/cities/' + target.data('city')
    }).done(function() {
      target.text("Changed");
      target.attr("name-city", "Changed");
      target.parent('li').children("a:last-child").attr("data-city", "Changed");
    });
  });
});
