/*
  Swaps banner images at timed intervals on page load.
  ¡Batching reflows by browsers causes animation not to work on newly created elements, accessing offsetWidth triggers reflow and fixes this!
  Shuffle feature: random ordering of header images on each page visit/load.
*/
var imageBnrBox;
// Fisher-Yates shuffle
function shuffle(array) {
  var i = 0, j = 0, temp = null;
  for (i = array.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1))
    temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  return array;
} //EOF
var shflImgArray = shuffle(hdrImgArr);
function runHdrImg() {
  var imgElem = imageBnrBox.querySelectorAll("img");
    imgElem.forEach(function(img){
      img.style.opacity = 0;
    });
    imgElem[Math.floor(Math.random() * imgElem.length)].style.opacity = 1;
} //EOF
function loadHdrImgs() {
  var i = 0;
  function rotate() {
    if (i >= shflImgArray.length) {
      clearTimeout(timeOut);
      interval = setInterval(runHdrImg, 20000);
      return;
    }
    newBannerImage = document.createElement("img");
    var flowFix = newBannerImage.offsetWidth; // see note: *
    let style 
    newBannerImage.addEventListener("load", function() {
      this.style.opacity = 1;
    });
    newBannerImage.src = defaultResources + "/images/banner/" + shflImgArray[i].filename;
    newBannerImage.setAttribute("style", shflImgArray[i].style);
    imageBnrBox.appendChild(newBannerImage);
    i++;
    timeOut = setTimeout(rotate, 20000);
  }
  rotate();
} //EOF
window.addEventListener("load", function() {
  imageBnrBox = document.getElementById("header-image");
  loadHdrImgs();
}); 