/*
  Swaps banner images at timed intervals, when all loaded then choosing at random.
  *batching reflows by browsers causes animation not to work on newly created elements, accessign offsetWidth triggers reflow and fixes this.
*/
var imageBnrBox;

function runHdrImg() {
  var imgElem = imageBnrBox.querySelectorAll("img");
    for (var i = 0; i < imgElem.length; i++) {
      imgElem[i].style.opacity = 0;
    }
    imgElem[Math.floor(Math.random() * imgElem.length)].style.opacity = 1;
}//EOF

function loadHdrImgs() {
  var i = 0;
  function rotate() {
    if (i >= hdrImgArray.length) {
      clearTimeout(timeOut);
      interval = setInterval(runHdrImg, 10000);
      return;
    }
    newBannerImage = document.createElement("img");
    newBannerImage.addEventListener("load", function() {
      imageBnrBox.appendChild(newBannerImage);
      var flowFix = newBannerImage.offsetWidth; // see note: *
      newBannerImage.style.opacity = 1;
    });
    newBannerImage.src = defaultResources + "/images/banner/" + hdrImgArray[i];
    i++;
    timeOut = setTimeout(rotate, 10000);
  }
  rotate();
}//EOF

window.addEventListener("load", function() {
  imageBnrBox = document.getElementById("header-image");
  loadHdrImgs();
}); 