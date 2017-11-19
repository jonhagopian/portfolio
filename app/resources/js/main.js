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

function rightColHeight() {
  if (document.querySelector(".full-column") === null ) {
    var leftCol = document.querySelector(".left-column");
    var rightCol = document.querySelector(".right-column");
    var mq = window.matchMedia("(min-width: 767px)");
    if (mq.matches) {
      rightCol.style.minHeight = leftCol.scrollHeight + "px";
    } else {
      rightCol.style.minHeight = null;
    }
  }
}

function hideScrollFF() {
  var imgBox = document.querySelector(".img-parallax");
  var innerWidth = imgBox.clientWidth;
  var fullWidth = imgBox.offsetWidth;
  var sbWidth = fullWidth - innerWidth;
  if (fullWidth > innerWidth) {
    imgBox.style.marginRight = "-" + sbWidth + "px";
    window.document.body.style.overflowX = "hidden";
  }
}

var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

window.addEventListener("load", function() {
  navSetup();
  imgSetup();
  rightColHeight();
  if (isFirefox) {
    hideScrollFF();
  }
});