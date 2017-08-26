// Image Slider
function sAnimate(box, boxW, sW, sMR, sOffsetArr, sImgArr) {
  var scrPos = box.scrollLeft;
  for (var i = 0; i < sOffsetArr.length; i++) {
    var sPos = sOffsetArr[i] + ((sW+sMR) / 2);
    var sPosVis = scrPos - sPos;
    var sPosPct = (sPosVis / boxW) * 100;
    sPosPct = sPosPct + 50;
    sPosPct = (sPosPct * 0.20).toFixed(4); // slow image movement by reducing this %, round to two decimal
    sImgArr[i].style.transform = "translateX(" + sPosPct + "%)";
  }
} //EOF

function imageSlider(firstRun) {
  if (firstRun === true) {
    //re-init slider
    window.addEventListener("resize", imageSlider);
    window.addEventListener("orientationchange", imageSlider);
  }
  var allSliders = document.querySelectorAll(".image_slider");
  // For each individual slider 'section' element
  for (var j = 0; j < allSliders.length; j++) {
    let box = allSliders[j];
    let boxW = box.offsetWidth;
    let s0 = box.querySelector("div");
    let sW = s0.offsetWidth;
    let sMR = parseFloat(getComputedStyle(s0).marginRight);
    let sF = sW + sMR;
    let sArr = box.querySelectorAll(".image_slide");
    // If screen is too wide, there is no need to run the slider
    if (sF * (sArr.length - 1) <= boxW) {
      box.setAttribute("class","image_slider justified");
      box.scrollLeft = 0;
    } else {
      box.setAttribute("class","image_slider");
      let sOffsetArr = [];
      let sImgArr = [];
      // For each individual slide within the parent slider
      for (var i = 0; i < sArr.length; i++) {
        sOffsetArr.push(sArr[i].offsetLeft);
        sImgArr.push(sArr[i].querySelector("img"));
      }
      box.addEventListener("scroll", function() {
        sAnimate(box, boxW, sW, sMR, sOffsetArr, sImgArr);
      });
      sAnimate(box, boxW, sW, sMR, sOffsetArr, sImgArr);
    }
  }
} //EOF

//init slider
window.addEventListener("load", function() {
  imageSlider(true);
});
// End Image Slider