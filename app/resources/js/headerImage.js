/*
  Swaps banner images at timed intervals, when all loaded then choosing at random.
  *batching reflows by browsers causes animation not to work on newly created elements, accessign offsetWidth triggers reflow and fixes this.
*/
var imageBnrBox;
var i = 0;
function loadHdrImgs() {
  var timeOut = setTimeout(function() {
    if (i >= hdrImgArray.length) {
      clearTimeout(timeOut);
      runHdrImg();
      return;
    }
    newBannerImage = document.createElement("img");
    newBannerImage.src = "images/banner/" + hdrImgArray[i];
    newBannerImage.onload = function() {
      imageBnrBox.appendChild(newBannerImage);
      var flowFix = newBannerImage.offsetWidth; // see note: *
      newBannerImage.style.opacity = 1;
    }
    i++;
    loadHdrImgs();
  }, 1000);
}// EOF
function runHdrImg() {
  var imgElem = imageBnrBox.querySelectorAll("img");
  window.setInterval(function() {
    for (var i = 0; i < imgElem.length; i++) {
      imgElem[i].style.opacity = 0;
    }
    imgElem[Math.floor(Math.random() * imgElem.length)].style.opacity = 1;
  }, 6000);
}//EOF
window.addEventListener("load", function() {
  imageBnrBox = document.getElementById("header-image");
  loadHdrImgs();
}); 