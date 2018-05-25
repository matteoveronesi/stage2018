function display_dropdown(n) {
    if (n == 1)
      var x = document.getElementById("iadd");
    else if (n == 2)
      var x = document.getElementById("");

    if (x.className.indexOf("w3-show") == -1) {
        x.className += " w3-show";
    } else {
        x.className = x.className.replace(" w3-show", "");
    }
}
