/*
  Swaps banner images at timed intervals from json, then choosing at random.
  *batching reflows by browsers causes animation not to work on newly created elements, accessign offsetWidth triggers reflow and fixes this.
*/
function hdrImg() {
  function randomImage() {
    return hdrImgArray[Math.floor(Math.random() * hdrImgArray.length)];
  }// EOF
  function swapHdrImg() {
    newBannerImage = document.createElement("img");
    newBannerImage.src = "images/banner/" + randomImage();
    newBannerImage.onload = function() {
      imageBnrBox.appendChild(newBannerImage);
      var flowFix = newBannerImage.offsetWidth; // see note: *
      newBannerImage.style.opacity = 1;
    }
  }// EOF
  var hdrImgArray = [];
  var imageBnrBox = document.getElementById("header-image");
  var xmlhttp = new XMLHttpRequest();

// Testing Local
  hdrImgArray = [
    "header-image-1.jpg",
    "header-image-2.jpg",
    "header-image-3.jpg",
    "header-image-4.jpg",
    "header-image-5.jpg",
    "header-image-6.jpg"
  ]
  swapHdrImg();
  var headlineTimer = setInterval(swapHdrImg, 60000);
  
// End Testing Local

/*  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      hdrImgArray = JSON.parse(this.responseText);
      swapHdrImg();
      var headlineTimer = setInterval(swapHdrImg, 6000);
      
    }
  };
  xmlhttp.open("GET", "resources/js/bannerImages.json", true);
  xmlhttp.send();
*/
}// EOF
window.addEventListener("load", function() {
  hdrImg();
});