function overlay() {
  var oBox = document.querySelector(".img-overlay-box");
  var overlay = document.querySelector(".img-overlay");
  var allImgs = [].slice.call(document.querySelectorAll(".img-overlay-box img, .img-overlay-box iframe"));
  var allLinks = [].slice.call(document.querySelectorAll(".overlayLink"));
  var closeBtn = document.querySelector(".img-overlay-close");
  var leftNav = document.querySelector(".img-overlay-left");
  var rightNav = document.querySelector(".img-overlay-right");
  var counter = 0;
  var lastImg;
  function imgNextPrev(currImg, listenerFired) {
    currImg.style.display = "block";
    // on click resize iframe to match height of its content body element & content body element width same as its parent iframes container
    if (currImg.nodeName === "IFRAME") {
      var content = currImg.contentDocument || currImg.contentWindow.document;
      currImg.style.height = content.body.scrollHeight + "px"; // get height of iframe content
      content.body.style.width = oBox.offsetWidth + "px"; // set iframe content body element width
    }
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
    oBox.style.top = top;
    oBox.style.height = scrollHeight + "px";
    oBox.style.marginTop = marTop + "px";
    if(!listenerFired) {
      lastImg = currImg;
      resizeListener();
    }
  } //EOF
  // event listeners in blocks in order to use removeEventListener
  function _forEventListenerResize() {
    var oresizeDone;
    clearTimeout(oresizeDone);
    oresizeDone = setTimeout(function() {
      imgNextPrev(lastImg, true);
    }, 66);
  } //EOF
  function _forEventListenerOchange() {
    imgNextPrev(lastImg, true);
  }// EOF
  function resizeListener() {
    window.removeEventListener("resize", _forEventListenerResize);
    removeEventListener("orientationchange", _forEventListenerOchange);
    window.addEventListener("resize", _forEventListenerResize);
    window.addEventListener("orientationchange", _forEventListenerOchange);
  }// EOF
  function closeOverlay() {
    overlay.style.display = "";
    allImgs.forEach(function(img) {
      img.style.display = "none";
    });
  }// EOF
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
  closeBtn.addEventListener("click", closeOverlay);
  overlay.addEventListener("click", closeOverlay);
  oBox.addEventListener("click", function(event) {
    event.stopPropagation();
  });
  rightNav.addEventListener("click", function(event) {
    allImgs[counter].style.display = "none";
    counter ++;
    imgNextPrev(allImgs[counter]);
    checkBtns("right");
    event.stopPropagation();
  });
  leftNav.addEventListener("click", function(event) {
    allImgs[counter].style.display = "none";
    counter --;
    imgNextPrev(allImgs[counter]);
    checkBtns("left");
    event.stopPropagation();
  });
  allLinks.forEach(function(links, index){
    let currImg = allImgs[index];
    let loc = index; // let since we want the value of loc to stay within for as written
    links.addEventListener("click", function(e) {
      overlay.style.display = "block";
      imgNextPrev(currImg);
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
// Init Overlay
window.addEventListener("load", function() {
  overlay();
});