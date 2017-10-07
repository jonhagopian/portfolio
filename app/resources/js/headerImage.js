/*
  Swaps banner images at timed intervals, when all loaded then choosing at random.
  *batching reflows by browsers causes animation not to work on newly created elements, accessign offsetWidth triggers reflow and fixes this.
*/
var imageBnrBox;
var i = 1;

function runHdrImg() {
  var imgElem = imageBnrBox.querySelectorAll("img");
  window.setInterval(function() {
    for (var i = 0; i < imgElem.length; i++) {
      imgElem[i].style.opacity = 0;
    }
    imgElem[Math.floor(Math.random() * imgElem.length)].style.opacity = 1;
  }, 10000);
}//EOF

function loadHdrImgs() {
  var timeOut = setTimeout(function() {
    if (i >= hdrImgArray.length) {
      clearTimeout(timeOut);
      runHdrImg();
      return;
    }
    newBannerImage = document.createElement("img");
    newBannerImage.addEventListener("load", function() {
      console.log("loaded header image: " + i);
      imageBnrBox.appendChild(newBannerImage);
      var flowFix = newBannerImage.offsetWidth; // see note: *
      newBannerImage.style.opacity = 1;
    });
    newBannerImage.src = defaultDomain + "/images/banner/" + hdrImgArray[i];
    i++;
    loadHdrImgs();
  }, 10000);
}//EOF

function startHdrImgs() {
  newBannerImage = document.createElement("img");
  newBannerImage.src = defaultDomain + "/images/banner/" + hdrImgArray[0]; 
  newBannerImage.onload = function() {
    imageBnrBox.appendChild(newBannerImage);
    var flowFix = newBannerImage.offsetWidth; // see note: *
    newBannerImage.style.opacity = 1;
  }
  loadHdrImgs();
}// EOF

window.addEventListener("load", function() {
  imageBnrBox = document.getElementById("header-image");
  startHdrImgs();
}); 