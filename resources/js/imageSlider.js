// Image Gallery Slider
function imageSlider(firstRun) {
  if (firstRun === true) {
    var resizeDone;
    window.addEventListener("resize", function() {
      clearTimeout(resizeDone);
      resizeDone = setTimeout(function() {
        imageSlider();
      }, 200);
    });
    window.addEventListener("orientationchange", imageSlider);
  }
  function syAnimate(box, boxH, sH, sOffsetArrT, sImgArr) {
    var scrPos = box.scrollTop;
    // for each individual image slide
    for (var i = 0; i < sOffsetArrT.length; i++) {
      var sPos = sOffsetArrT[i] + (sH / 2);
      var sPosVis = scrPos - sPos;
      var sPosPct = (sPosVis / boxH) * 100; // get the percentage to apply to image inside
      sPosPct = sPosPct + 50; // plus 50% for center
      sPosPct = (sPosPct * 0.20).toFixed(2); // change image movement lag by reducing the %
      sImgArr[i].style.transform = "translateY(" + sPosPct + "%)";
    }
  } //EOF
  function sxAnimate(box, boxW, sW, sOffsetArrL, sImgArr) {
    var scrPos = box.scrollLeft;
    // for each individual image slide
    for (var i = 0; i < sOffsetArrL.length; i++) {
      var sPos = sOffsetArrL[i] + (sW / 2);
      var sPosVis = scrPos - sPos;
      var sPosPct = (sPosVis / boxW) * 100; // get the percentage to apply to image inside
      sPosPct = sPosPct + 50; // plus 50% for center
      sPosPct = (sPosPct * 0.20).toFixed(2); // change image movement lag by reducing the %
      sImgArr[i].style.transform = "translateX(" + sPosPct + "%)";
    }
  } //EOF
  var allSliders = document.querySelectorAll(".image-slider");
  for (var j = 0; j < allSliders.length; j++) { // For each individual gallery element
    let box = allSliders[j];
    let sArr = box.querySelectorAll("figure");
    let sImgArr = box.querySelectorAll("figure img");
    // if horizontal/vertical scroll switch
    let flexDir = window.getComputedStyle(box).flexDirection;
    if (flexDir === "row") {
      let boxW = box.offsetWidth;
      let sW = box.querySelector("figure").offsetWidth;
      let sWm = box.querySelector("figure").offsetWidth + parseInt(getComputedStyle(box.querySelector("figure")).marginRight); // with margins
      let sOffsetArrL = [];
      for (var i = 0; i < sArr.length; i++) {
        sOffsetArrL.push(sArr[i].offsetLeft);
      }
      let _forEventListener = function() {
        sxAnimate(box, boxW, sW, sOffsetArrL, sImgArr);
      }
      box.addEventListener("scroll", _forEventListener);
      sxAnimate(box, boxW, sW, sOffsetArrL, sImgArr);
      window.addEventListener("resize", function() {
        box.removeEventListener("scroll", _forEventListener)
      });
      window.addEventListener("orientationchange", function() {
        box.removeEventListener("scroll", _forEventListener)
      });
    } else if (flexDir === "column") {
      let boxH = box.offsetHeight;
      let sH = box.querySelector("figure").offsetHeight;
      let sHm = box.querySelector("figure").offsetHeight + parseInt(getComputedStyle(box.querySelector("figure")).marginBottom); // with margins
      let sOffsetArrT = [];
      for (var i = 0; i < sArr.length; i++) {
        sOffsetArrT.push(sArr[i].offsetTop);
        // Aspect ratio adjust
        var newHeight = parseInt(getComputedStyle(sArr[i]).width) * 0.66;
        newHeight = Math.round(newHeight);
        sArr[i].setAttribute("style", "height: " + newHeight + "px;");
      }
      let _forEventListener = function() {
        syAnimate(box, boxH, sH, sOffsetArrT, sImgArr);
      }
      box.addEventListener("scroll", _forEventListener);
      syAnimate(box, boxH, sH, sOffsetArrT, sImgArr);
      window.addEventListener("resize", function() {
        box.removeEventListener("scroll", _forEventListener)
      });
      window.addEventListener("orientationchange", function() {
        box.removeEventListener("scroll", _forEventListener)
      });
    } // End if else row/column

  } // End for
} //EOF
// Init Slider
window.addEventListener("load", function() {
  imageSlider(true);
});
// End Image Gallery Slider