function overlay() {
  var overlay = document.querySelector(".img-overlay");
  var allImgs = document.querySelectorAll(".img-overlay-box img");
  var allLinks = document.querySelectorAll(".overlayLink");
  var closeBtn = document.querySelector(".img-overlay-close");
  var leftNav = document.querySelector(".img-overlay-left");
  var rightNav = document.querySelector(".img-overlay-right");
  var counter = 0;
  closeBtn.addEventListener("click", function() {
    overlay.style.display = "";
    allImgs.forEach(function(img) {
      img.removeAttribute("style");
    });
  });
  rightNav.addEventListener("click", function() {
      allImgs[counter].removeAttribute("style");
      counter ++;
      allImgs[counter].style.display = "block";
      checkBtns("right");
  });
  leftNav.addEventListener("click", function() {
      allImgs[counter].removeAttribute("style");
      counter --;
      allImgs[counter].style.display = "block";
      checkBtns("left");
  });
  function checkBtns(dir) {
    if(dir === "right" || counter > 0) {
      leftNav.style.display = "block";
      if(counter === (allImgs.length - 1)) {
        rightNav.style.display = "none";
      }
    }
    if (dir === "left" || counter < (allImgs.length - 1)) {
      rightNav.style.display = "block";
      if(counter === 0) {
        leftNav.style.display = "none";
      }
    } 
  }// EOF
  allLinks.forEach(function(links, index){
    let currImg = allImgs[index];
    let loc = index; // let since we want the value of loc to stay within for as written
    links.addEventListener("click", function() {
      overlay.style.display = "block";
      currImg.style.display = "block";
      counter = loc;
      if(counter === 0) {
        leftNav.style.display = "none";
      } else {
        leftNav.style.display = "block";
      }
      if(counter === (allImgs.length - 1)) {
        rightNav.style.display = "none";
      } else {
        rightNav.style.display = "block";
      }
    });
  });
  checkBtns("start");
}// EOF

// Init Ovelay Images
window.addEventListener("load", function() {
  overlay();
});