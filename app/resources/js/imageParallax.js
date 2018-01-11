/* This gallery with parallax effect can support the following: Images and Iframes. This effect will work on both X & Y axis. Syntax to modularize and contain scope within imgParallax object */
var imgParallax = {

  forEventListener : function() {},
  // shorter syntax available - syAnimate(params) {}
  syAnimate : function(box, boxH, sH, sOffsetArrT, sImgArr, flag) {
    if (flag === "full") {
      var scrPos = document.body.scrollTop;
      var pct = 0.15;
    } else {
      var scrPos = box.scrollTop;
      var pct = 0.15;
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
  },

  sxAnimate : function(box, boxW, sW, sOffsetArrL, sImgArr) {
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
  },

  setupTwo : function() { // forEach gallery element
    var mq = window.matchMedia("(min-width: 767px)");
    var page = document.body.id;
    var allGalleries = [].slice.call(document.querySelectorAll(".img-parallax"));
    if (mq.matches && page === "items-list") {
      var elem = [].slice.call(document.querySelectorAll(".img-parallax"));
      elem.forEach(function(e) {
        removeClass(e,"img-parallax");
        var figures = [].slice.call(e.querySelectorAll(".img-slide"));
        figures.forEach(function(figure) {
          figure.removeAttribute("style");
          var img = figure.getElementsByTagName("img")[0];
          img.removeAttribute("style");
        });
      });
      return;
    } else {
      var elem = [].slice.call(document.querySelectorAll(".item-grid"));
      elem.forEach(function(e) {
        if (e.className.indexOf("img-parallax") === -1) { 
          e.className = e.className += " img-parallax";
        }
      });
    }
    allGalleries.forEach((sBox) => {
      let box = sBox;
      let sArr = [].slice.call(box.querySelectorAll("figure"));
      let sImgArr = [].slice.call(box.querySelectorAll("figure img, figure iframe")); // iframe is for sample code
      // Clear out transform on resize
      sImgArr.forEach((sImg, index) => {
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
        sArr.forEach((sOffset, index) => {
          sOffsetArrL.push(sOffset.offsetLeft);
        });
        this.forEventListener = () => {
          this.sxAnimate(box, boxW, sW, sOffsetArrL, sImgArr);
        }
        this.sxAnimate(box, boxW, sW, sOffsetArrL, sImgArr);
      } else if (flexDir === "column") {
        box.scrollTop = 0;
        if (page === "items-list") {
          var boxH = window.innerHeight;
          var flag = "full";
          box = document;
        } else {
          var boxH = box.offsetHeight;
          var flag = "fixed";
        }
        var sH = box.querySelector("figure").offsetHeight;
        var sOffsetArrT = [];
        sArr.forEach((sOffset, index) => {
          sOffsetArrT.push(sOffset.offsetTop);
          var newHeight = parseInt(getComputedStyle(sOffset).width) * 0.66; // Aspect ratio adjust
          newHeight = Math.round(newHeight);
          sOffset.setAttribute("style", "height: " + newHeight + "px;");
        });
        this.forEventListener = () => {
          this.syAnimate(box, boxH, sH, sOffsetArrT, sImgArr, flag);
        }
        this.syAnimate(box, boxH, sH, sOffsetArrT, sImgArr, flag);
      } // End if else row/column
      // switch box to doc if vertical scroll is full this.page
      box.addEventListener("scroll", this.forEventListener);
      window.addEventListener("resize", function() {
        box.removeEventListener("scroll", this.forEventListener)
      });
      window.addEventListener("orientationchange", function() {
        box.removeEventListener("scroll", this.forEventListener)
      });
    }); // End forEach
  },

  setupOne : function() { // first run and initial css setup
    var resizeDone;
    window.addEventListener("resize", function() {
      clearTimeout(resizeDone);
      resizeDone = setTimeout(() => {
        rightColHeight(); // see main.js
        imgParallax.setupTwo(); // scope is window
      }, 66);
    });
    window.addEventListener("orientationchange", this.setupTwo);
    this.setupTwo();
  }

} // End imgParallax

window.addEventListener("load", function() {
  if(document.querySelector(".img-parallax") !== null) {
    imgParallax.setupOne();
  }
});