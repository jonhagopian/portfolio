/*
  Swaps banner images at timed intervals, when all loaded then choosing at random.
  *batching reflows by browsers causes animation not to work on newly created elements, accessign offsetWidth triggers reflow and fixes this.
*/
var imageBnrBox;
var i = 1;
var timeOut;
var interval;

function runHdrImg() {
  var imgElem = imageBnrBox.querySelectorAll("img");
    for (var i = 0; i < imgElem.length; i++) {
      imgElem[i].style.opacity = 0;
    }
    imgElem[Math.floor(Math.random() * imgElem.length)].style.opacity = 1;
    console.log("Running rotation complete");
}//EOF

function loadHdrImgs() {
  if (i >= hdrImgArray.length) {
    clearTimeout(timeOut);
    interval = setInterval(runHdrImg, 10000);
    console.log("cleared Timeout and runHdrImg");
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
  timeOut = setTimeout(loadHdrImgs, 10000);
}//EOF

function startHdrImgs() {
  newBannerImage = document.createElement("img");
  newBannerImage.src = defaultDomain + "/images/banner/" + hdrImgArray[0]; 
  newBannerImage.addEventListener("load", function() {
    imageBnrBox.appendChild(newBannerImage);
    var flowFix = newBannerImage.offsetWidth; // see note: *
    newBannerImage.style.opacity = 1;
    console.log("done start and loading hdr img func");
    timeOut = setTimeout(loadHdrImgs, 1000);
  });
}//EOF

window.addEventListener("load", function() {
  imageBnrBox = document.getElementById("header-image");
  startHdrImgs();
}); 