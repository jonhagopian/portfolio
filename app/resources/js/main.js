function navSetup() {
  var headerNav = document.getElementById("navigation");
  var headerNavBtn = document.getElementById("navigationBtn");
  function navOpenClose() {
    if (headerNav.className === "open") {
      headerNav.className = "close";
    } else {
      headerNav.className = "open";
    }
  }
  headerNavBtn.addEventListener("click", navOpenClose);
  headerNav.removeAttribute("style");
}

function imgSetup() {
  var allImg = document.querySelectorAll("img[data-src]");
  for (var i = 0; i < allImg.length; i++) {
    allImg[i].setAttribute("src", allImg[i].getAttribute("data-src"));
    allImg[i].onload = function() {
      this.removeAttribute("data-src");
    };
  }
}

function removeClass(e, c) {
  e.className = e.className.replace(new RegExp("(?:^|\\s)" + c + "(?!\\S)") ,"");
}

window.addEventListener("load", function() {
  navSetup();
  imgSetup();
});