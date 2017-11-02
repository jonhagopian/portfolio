function imageSlider(firstRun) {
  if (firstRun === true) {
    var resizeDone;
    window.addEventListener("resize", function() {
      clearTimeout(resizeDone);
      resizeDone = setTimeout(function() {
        imageSlider();
      }, 400);
    });
    window.addEventListener("orientationchange", imageSlider);
  }


    var mq = window.matchMedia("(min-width: 767px)");
    var page = document.body.id;
    if (mq.matches && page === "item-grid") {
      var elem = document.querySelectorAll(".img-parallax");
      elem.forEach(function(e) {
        removeClass(e,"img-parallax");
      });
    } else {
      var elem = document.querySelectorAll(".item-grid");
      elem.forEach(function(e) {
        e.className = e.className += " img-parallax";
      });
    }


  function syAnimate(box, boxH, sH, sOffsetArrT, sImgArr, flag) { // fixed height box
    if (flag === "full") {
      var scrPos = document.body.scrollTop;
    } else {
      var scrPos = box.scrollTop;
    }
    // forEach individual image slide
    sOffsetArrT.forEach(function(sOffset, index){
      var sPos = sOffset + (sH / 2);
      var sPosVis = scrPos - sPos;
      var sPosPct = (sPosVis / boxH) * 100; // get the percentage to apply to image inside
      sPosPct = sPosPct; // plus 0 for center, not running off center for vertical
      sPosPct = (sPosPct * 0.25).toFixed(2); // change image movement lag by reducing the %
      sImgArr[index].style.transform = "translateY(" + sPosPct + "%)";
    });
  } //EOF

  function sxAnimate(box, boxW, sW, sOffsetArrL, sImgArr) {
    var scrPos = box.scrollLeft;
    // forEach individual image slide
    sOffsetArrL.forEach(function(sOffset, index){
      var sPos = sOffset + (sW / 2);
      var sPosVis = scrPos - sPos;
      var sPosPct = (sPosVis / boxW) * 100; // get the percentage to apply to image inside
      sPosPct = sPosPct + 50; // plus 50% for center
      sPosPct = (sPosPct * 0.20).toFixed(2); // change image movement lag by reducing the %
      sImgArr[index].style.transform = "translateX(" + sPosPct + "%)";
    });
  } //EOF
  var allSliders = document.querySelectorAll(".img-parallax");
  // forEach individual gallery element
  allSliders.forEach(function(sBox) {
    let box = sBox; // let so values aren't overwritten
    let sArr = box.querySelectorAll("figure");
    let sImgArr = box.querySelectorAll("figure img");
    // Clear out transform on resize
    sImgArr.forEach(function(sImg, index) {
      sImg.removeAttribute("style");
      sArr[index].removeAttribute("style");
    });
    // if horizontal/vertical scroll switch, and overflow for full hight hidden for fixed
    var flexDir = window.getComputedStyle(box).flexDirection;
    var overFlow = window.getComputedStyle(box).overflow;
    if (flexDir === "row") {
      box.scrollLeft = 0; // reset scroll to beginning
      var boxW = box.offsetWidth;
      var sW = box.querySelector("figure").offsetWidth;
      var sOffsetArrL = [];
      sArr.forEach(function(sOffset, index) {
        sOffsetArrL.push(sOffset.offsetLeft);
      });
      var _forEventListener = function() {
        sxAnimate(box, boxW, sW, sOffsetArrL, sImgArr);
      }
      sxAnimate(box, boxW, sW, sOffsetArrL, sImgArr);
    } else if (flexDir === "column") {
      box.scrollTop = 0;
      if (overFlow === "visible") {
        var boxH = document.body.offsetHeight; // height of element that is scrolling
        var flag = "full";
      } else {
        var boxH = box.offsetHeight;
        var flag = "fixed";
      }
      var sH = box.querySelector("figure").offsetHeight;
      var sOffsetArrT = [];
      sArr.forEach(function(sOffset, index) {
        sOffsetArrT.push(sOffset.offsetTop);
        var newHeight = parseInt(getComputedStyle(sOffset).width) * 0.66; // Aspect ratio adjust
        newHeight = Math.round(newHeight);
        sOffset.setAttribute("style", "height: " + newHeight + "px;");
      });
      var _forEventListener = function() {
        syAnimate(box, boxH, sH, sOffsetArrT, sImgArr, flag);
      }
      syAnimate(box, boxH, sH, sOffsetArrT, sImgArr, flag);
    } // End if else row/column
    if (overFlow === "visible") {
      box = document;
    }
    box.addEventListener("scroll", _forEventListener);
    window.addEventListener("resize", function() {
      box.removeEventListener("scroll", _forEventListener)
    });
    window.addEventListener("orientationchange", function() {
      box.removeEventListener("scroll", _forEventListener)
    });
  }); // End forEach
} //EOF
window.addEventListener("load", function() {
  if(document.querySelector(".img-parallax") !== null) {
    imageSlider(true);
  }
});