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
  // Desktop Navigation
  var timeOut = [];
  var scrollComplete;
  function move(box, sWm, sImgArr, direction, btnL, btnR, target, snap) {
    if (typeof snap === "number") {
      var scrollRt = snap;
      var scrollLt = snap;
      var scrollAmt = 1;
    } else {
      var scrollRt = box.scrollLeft + sWm;
      var scrollLt = box.scrollLeft - sWm;
      var scrollAmt = 7; // divide into sWm no remainder
    }
    function moveScrollRt() {
      if (box.scrollLeft < scrollRt) {
        box.scrollLeft += scrollAmt; 
        timeOut[target][1] = "moving";
        timeOut[target][0] = setTimeout(moveScrollRt, 10);
      } else {
        timeOut[target][1] = "done";
        return;
      }
    }
    function moveScrollLt() {
      if (box.scrollLeft > scrollLt) {
        box.scrollLeft -= scrollAmt;
        timeOut[target][1] = "moving";
        timeOut[target][0] = setTimeout(moveScrollLt, 10);
      } else {
        timeOut[target][1] = "done";
        return;
      }
    }
    if (direction === "right") {
      if (box.scrollLeft > (sImgArr.length - 2) * sWm) {
        btnR.style.display = "none"; // hide btn after click of 2nd to last
      } else {
        btnL.removeAttribute("style");
      }
      if (timeOut[target][1] !== "done") {
        return;
      } else {
        moveScrollRt();
      }
    } else if (direction === "left") {
      if (box.scrollLeft < sWm) {
        btnL.style.display = "none"; // hide btn after back click on first
      } else {
        btnR.removeAttribute("style");
      }
      if (timeOut[target][1] !== "done") {
        return;
      } else {
        moveScrollLt();
      }
    }
  } //EOF
  // End Desktop Navigation
  function sAnimate(box, boxW, sW, sOffsetArr, sImgArr) {
    var scrPos = box.scrollLeft;
    // for each individual image slide
    for (var i = 0; i < sOffsetArr.length; i++) {
      var sPos = sOffsetArr[i] + (sW / 2);
      var sPosVis = scrPos - sPos;
      var sPosPct = (sPosVis / boxW) * 100; // get the percentage to apply to image inside
      sPosPct = sPosPct + 50; // plus 50% for center
      sPosPct = (sPosPct * 0.20).toFixed(2); // change image movement lag by reducing the %
      sImgArr[i].style.transform = "translateX(" + sPosPct + "%)";
    }
  } //EOF
  var allSliders = document.querySelectorAll(".image-slider-container");
  // For each individual gallery
  for (var j = 0; j < allSliders.length; j++) {
    let container = allSliders[j];
    let box = container.querySelector("div[class='image-slider']");
    let boxW = box.offsetWidth;
    let sArr = box.querySelectorAll("figure");
    let sW = box.querySelector("figure").offsetWidth;
    let sWm = box.querySelector("figure").offsetWidth + parseInt(getComputedStyle(box.querySelector("figure")).marginRight); // with margins
    let sOffsetArr = [];
    let spacerDiv = document.createElement("div");
    spacerDiv.setAttribute("style", "width: " + (box.offsetWidth - sWm) + "px");
    box.appendChild(spacerDiv);
    for (var i = 0; i < sArr.length; i++) {
      sOffsetArr.push(sArr[i].offsetLeft);
    }
    let sImgArr = box.querySelectorAll("figure img");
    let dir = "";
    box.setAttribute("class","image-slider");
    let _forEventListener = function() {
      sAnimate(box, boxW, sW, sOffsetArr, sImgArr);
      // Begin scroll snap
      clearTimeout(scrollComplete);
      scrollComplete = setTimeout(function() {
        roundedDown = Math.round(box.scrollLeft/sWm)*sWm;
        if (roundedDown >= box.scrollLeft) {
          dir = "right";
        } else {
          dir = "left";
        }
        move(box, sWm, sImgArr, dir, btnLeft, btnRight, target, roundedDown);
      }, 1000);
      // End scroll snap
    }
    box.addEventListener("scroll", _forEventListener);
    window.addEventListener("resize", function() {
      box.removeEventListener("scroll", _forEventListener)
    });
    window.addEventListener("orientationchange", function() {
      box.removeEventListener("scroll", _forEventListener)
    });
    sAnimate(box, boxW, sW, sOffsetArr, sImgArr);
    // Begin Desktop Specific
    timeOut.push([j,"done"]); // create global timeOut variables for desktop nav
    let target = j; // desktop nav target
    let btnLeft = container.querySelector("div[class='btn-slider btn-slider-l']");
    let btnRight = container.querySelector("div[class='btn-slider btn-slider-r']");
    btnLeft.style.display = "none"; // initial hide left
    let _forNavLeft = function() {
      move(box, sWm, sImgArr, "left", btnLeft, btnRight, target, "no");
    }
    let _forNavRight = function() {
      move(box, sWm, sImgArr, "right", btnLeft, btnRight, target, "no");
    }
    btnLeft.addEventListener("click", _forNavLeft);
    btnRight.addEventListener("click", _forNavRight);
    // End Desktop Specific
  }
} //EOF

// Init Slider
window.addEventListener("load", function() {
  imageSlider(true);
});
// End Image Gallery Slider