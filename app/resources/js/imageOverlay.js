function overlay() {
  var oBox = document.querySelector(".img-overlay-box");
  var overlay = document.querySelector(".img-overlay");
  var allImgs = document.querySelectorAll(".img-overlay-box img");
  var allLinks = document.querySelectorAll(".overlayLink");
  var closeBtn = document.querySelector(".img-overlay-close");
  var leftNav = document.querySelector(".img-overlay-left");
  var rightNav = document.querySelector(".img-overlay-right");
  var counter = 0;
  var lastImg;

  function swapimgVcenter(currImg, listenerFired) {
    currImg.setAttribute("style", "display: block;");
    var imgHeight = currImg.scrollHeight;
    var winHeight = window.innerHeight;
    var marTop = 0;
    var scrollHeight = 0;
    var top = 0;
    if (winHeight < imgHeight + 40) {
      top = 0;
      marTop = 40;
      scrollHeight = winHeight - (winHeight * .1);
    } else {
      top = "50%";
      marTop = -imgHeight/2;
      scrollHeight = imgHeight;
    }
    oBox.setAttribute("style", "top: " + top + "; height: " + scrollHeight + "px; margin-top: " + marTop + "px;");
    if(!listenerFired) {
      lastImg = currImg;
      resizeListener();
      console.log("resized and No Listener Fired");
    }
    console.log("resized");
  }

  // We need event listeners in blocks so we can use removeEventListener
  function _forEventListenerResize() {
    var oresizeDone;
    clearTimeout(oresizeDone);
    oresizeDone = setTimeout(function() {
      swapimgVcenter(lastImg, true);
    }, 66);
  }

  function _forEventListenerOchange() {
    swapimgVcenter(lastImg, true);
  }

  function resizeListener() {
    window.removeEventListener("resize", _forEventListenerResize);
    removeEventListener("orientationchange", _forEventListenerOchange);
    window.addEventListener("resize", _forEventListenerResize);
    window.addEventListener("orientationchange", _forEventListenerOchange);
  }

  function closeOverlay() {
    overlay.style.display = "";
    allImgs.forEach(function(img) {
      img.removeAttribute("style");
    });
  }
  closeBtn.addEventListener("click", closeOverlay);
  overlay.addEventListener("click", closeOverlay);
  oBox.addEventListener("click", function(event) {
    event.stopPropagation();
  });
  rightNav.addEventListener("click", function(event) {
      allImgs[counter].removeAttribute("style");
      counter ++;
      swapimgVcenter(allImgs[counter]);
      checkBtns("right");
      event.stopPropagation();
  });
  leftNav.addEventListener("click", function(event) {
      allImgs[counter].removeAttribute("style");
      counter --;
      swapimgVcenter(allImgs[counter]);
      checkBtns("left");
      event.stopPropagation();
  });
  function checkBtns(dir) {
    if(dir === "right" || counter > 0) {
      leftNav.style.display = "block";
      if(counter === (allImgs.length - 1)) {
        rightNav.style.display = "none";
      }
    }
    if (dir === "left" || counter < (allImgs.length - 1)) {
      rightNav.style.display = "block";
      if(counter === 0) {
        leftNav.style.display = "none";
      }
    } 
  }// EOF
  allLinks.forEach(function(links, index){
    let currImg = allImgs[index];
    let loc = index; // let since we want the value of loc to stay within for as written
    links.addEventListener("click", function() {
      overlay.style.display = "block";
      swapimgVcenter(currImg);
      counter = loc;
      if(counter === 0) {
        leftNav.style.display = "none";
      } else {
        leftNav.style.display = "block";
      }
      if(counter === (allImgs.length - 1)) {
        rightNav.style.display = "none";
      } else {
        rightNav.style.display = "block";
      }
    });
  });
  checkBtns("start");
}// EOF

// Init Ovelay Images
window.addEventListener("load", function() {
  overlay();
});