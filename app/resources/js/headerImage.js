/*
  Swaps banner images at timed intervals, when all loaded then choosing at random.
  *batching reflows by browsers causes animation not to work on newly created elements, accessign offsetWidth triggers reflow and fixes this. Shuffle feature: random ordering of header images on each page visit/load.
*/
var imageBnrBox;

//Fisher-Yates shuffle
function shuffle(array) {
  var i = 0
    , j = 0
    , temp = null

  for (i = array.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1))
    temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  return array;
}//EOF

var shflImgArray = shuffle(hdrImgArray);

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
    if (i >= shflImgArray.length) {
      clearTimeout(timeOut);
      interval = setInterval(runHdrImg, 20000);
      return;
    }
    newBannerImage = document.createElement("img");
    newBannerImage.addEventListener("load", function() {
      imageBnrBox.appendChild(newBannerImage);
      var flowFix = newBannerImage.offsetWidth; // see note: *
      newBannerImage.style.opacity = 1;
    });
    newBannerImage.src = defaultResources + "/images/banner/" + shflImgArray[i];
    i++;
    timeOut = setTimeout(rotate, 20000);
  }
  rotate();
}//EOF

window.addEventListener("load", function() {
  imageBnrBox = document.getElementById("header-image");
  loadHdrImgs();
}); 