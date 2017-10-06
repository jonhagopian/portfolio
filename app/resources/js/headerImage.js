/*
  Swaps banner images at timed intervals from json, then choosing at random.
  *batching reflows by browsers causes animation not to work on newly created elements, accessign offsetWidth triggers reflow and fixes this.
*/
function hdrImg() {
  function randomImage() {
    // hdrImgArray values exist in and include rendered in head.ejs 
    return hdrImgArray[Math.floor(Math.random() * hdrImgArray.length)];
  }// EOF
  var imageBnrBox = document.getElementById("header-image");
  function swapHdrImg() {
    newBannerImage = document.createElement("img");
    newBannerImage.src = "images/banner/" + randomImage();
    newBannerImage.onload = function() {
      imageBnrBox.appendChild(newBannerImage);
      var flowFix = newBannerImage.offsetWidth; // see note: *
      newBannerImage.style.opacity = 1;
    }
  }// EOF
  headlineTimer = setInterval(swapHdrImg, 6000);
  swapHdrImg();
}// EOF
window.addEventListener("load", function() {
  hdrImg();
}); 