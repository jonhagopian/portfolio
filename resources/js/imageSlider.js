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
  function sAnimate(box, boxW, sW, sOffsetArr, sImgArr) {
    var scrPos = box.scrollLeft;
    // for each individual image slide
    for (var i = 0; i < sOffsetArr.length; i++) {
      var sPos = sOffsetArr[i] + (sW / 2);
      var sPosVis = scrPos - sPos;
      var sPosPct = (sPosVis / boxW) * 100;
      sPosPct = sPosPct + 50; // plus 50% for center
      sPosPct = (sPosPct * 0.20).toFixed(2); // change image movement lag by reducing the %
      sImgArr[i].style.transform = "translateX(" + sPosPct + "%)";
    }
  } //EOF
  var allSliders = document.querySelectorAll(".image_slider");
  // For each individual gallery
  for (var j = 0; j < allSliders.length; j++) {
    let box = allSliders[j];
    let boxW = box.offsetWidth;
    let sArr = box.querySelectorAll("figure");
    let sW = box.querySelector("figure").offsetWidth;
    let sOffsetArr = [];
    for (var i = 0; i < sArr.length; i++) {
      sOffsetArr.push(sArr[i].offsetLeft);
    }
    let sImgArr = box.querySelectorAll("figure img");
    // If screen is too wide, no slider
    if (box.scrollWidth <= boxW) {
      box.setAttribute("class","image_slider justified");
      box.scrollLeft = 0;
      for (var i = 0; i < sImgArr.length; i++) {
        sImgArr[i].style.transform = "translateX(0%)";
      }
    } else {
      box.setAttribute("class","image_slider");
      let _forEventListener = function() {
        sAnimate(box, boxW, sW, sOffsetArr, sImgArr);
      }
      box.addEventListener("scroll", _forEventListener);
      window.addEventListener("resize", function() {
        box.removeEventListener("scroll", _forEventListener)
      });
      window.addEventListener("orientationchange", function() {
        box.removeEventListener("scroll", _forEventListener)
      });
      sAnimate(box, boxW, sW, sOffsetArr, sImgArr);
    }
  }
} //EOF

// Init Slider
window.addEventListener("load", function() {
  imageSlider(true);
});
// End Image Gallery Slider