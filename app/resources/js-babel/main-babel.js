"use strict";

// Site redirect for less than IE11
function detectIE() {
  if (navigator.userAgent.indexOf("MSIE") >= 0) {
    window.location = "/static/badbrowser.html";
  }
  return false;
}
detectIE();
// End Site redirect for less than IE11

var isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;

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
    allImg[i].onload = function () {
      this.removeAttribute("data-src");
    };
  }
}

function removeClass(e, c) {
  e.className = e.className.replace(new RegExp("(?:^|\\s)" + c + "(?!\\S)"), "");
}

function rightColHeight() {
  if (document.querySelector(".full-column") === null) {
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

function main() {
  window.addEventListener("load", function () {
    navSetup();
    imgSetup();
    rightColHeight();
    if (isFirefox) {
      hideScrollFF();
    }
  });
}

// ES6 shim, if ES6 features aren't supported load shim and others
// Credit: https://philipwalton.com/articles/loading-polyfills-only-when-needed/
function browserSupportsAllFeatures() {
  return window.Promise && window.fetch && window.Symbol;
}

function loadScript(src, done) {
  var js = document.createElement("script");
  js.src = src;
  js.onload = function () {
    done();
  };
  js.onerror = function () {
    done(new Error("Failed to load script " + src));
  };
  document.head.appendChild(js);
}

if (browserSupportsAllFeatures()) {
  // Browsers that support all features.
  loadScript("/js/imageParallax.js", main);
} else {
  // All other browsers then run `main()`.
  loadScript("/js-babel/imageParallax-babel.js", main);
}
// End ES6 shim and others
