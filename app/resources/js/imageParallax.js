function imageSlider(firstRun) {

  function syAnimate(box, boxH, sH, sOffsetArrT, sImgArr, flag) {
    if (flag === "full") {
      var scrPos = document.body.scrollTop;
      var pct = 0.10;
    } else {
      var scrPos = box.scrollTop;
      var pct = 0.25;
    }
    // forEach individual image slide
    sOffsetArrT.forEach(function(sOffset, index) {
      var sPos = sOffset + (sH / 2);
      var sPosVis = scrPos - sPos;
      var sPosPct = (sPosVis / boxH) * 100; // get the percentage to apply to image inside
      sPosPct = sPosPct; // plus 0 for center, not running off center for vertical
      sPosPct = (sPosPct * pct).toFixed(2); // change image movement lag by reducing the %
      sImgArr[index].style.transform = "translateY(" + sPosPct + "%)";
    });
  } //EOF

  function sxAnimate(box, boxW, sW, sOffsetArrL, sImgArr) {
    var scrPos = box.scrollLeft;
    // forEach individual image slide
    sOffsetArrL.forEach(function(sOffset, index) {
      var sPos = sOffset + (sW / 2);
      var sPosVis = scrPos - sPos;
      var sPosPct = (sPosVis / boxW) * 100; // get the percentage to apply to image inside
      sPosPct = sPosPct + 50; // plus 50% for center
      sPosPct = (sPosPct * 0.20).toFixed(2); // change image movement lag by reducing the %
      sImgArr[index].style.transform = "translateX(" + sPosPct + "%)";
    });
  } //EOF

  // Begin base function
  if (firstRun === true) {
    var resizeDone;
    window.addEventListener("resize", function() {
      clearTimeout(resizeDone);
      resizeDone = setTimeout(function() {
        imageSlider();
      }, 66);
    });
    window.addEventListener("orientationchange", imageSlider);
  }

  // Remove class img-parallax on category page for desktop 
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

  var allGalleries = document.querySelectorAll(".img-parallax");
  // forEach individual gallery element
  allGalleries.forEach(function(sBox) {
    let box = sBox; // let so values aren't overwritten
    let sArr = box.querySelectorAll("figure");
    let sImgArr = box.querySelectorAll("figure img, figure iframe"); // iframe is for sample code
    // Clear out transform on resize
    sImgArr.forEach(function(sImg, index) {
      sImg.removeAttribute("style");
      sArr[index].removeAttribute("style");
    });
    // if horizontal/vertical scroll switch
    var flexDir = window.getComputedStyle(box).flexDirection;
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
      if (page === "item-grid") {
        var boxH = window.innerHeight;
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
    // switch box to doc if vertical scroll is full page
    if (page === "item-grid") {
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

// Add CSS style to iframe which contains sample code file
function updateIframe() {
  var iframeArr = document.getElementsByClassName("iframeSampleCode");
  if (iframeArr.length > -1) {
    // Use this solution below 'forEach' since iframeArr is a 'NodeLIst' type
    Array.prototype.forEach.call(iframeArr, elem => {
      var content = elem.contentDocument || elem.contentWindow.document;
      content.body.style.color = "#a6e22c";
      content.body.style.padding = "2em"; 
      content.body.style.cursor = "pointer";
      content.body.style.boxSizing = "border-box"
    });
  }
}

window.addEventListener("load", function() {
  if(document.querySelector(".img-parallax") !== null) {
    imageSlider(true);
    updateIframe();
  }
});