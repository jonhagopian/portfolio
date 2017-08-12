function imageSlider() {
  var imageSlider = document.getElementById('image_slider');
  var firstSlide = imageSlider.getElementsByTagName('div')[0];
  var slideWidth = firstSlide.offsetWidth;
  var fullSlideWidth = slideWidth + parseInt(getComputedStyle(firstSlide).marginRight);
  var imageSlidesArray = document.getElementsByClassName('image_slide');
  function slideAnimation() {
    var imageSliderWidth = imageSlider.offsetWidth;
    var scrollPos = imageSlider.scrollLeft;
    if (fullSlideWidth * (imageSlidesArray.length - 1) <= imageSliderWidth ) {
      image_slider.setAttribute('class','justified');
    } else {
      for (var i = 0; i < imageSlidesArray.length; i++) {
        var slide = imageSlidesArray[i];
        //current slides center, distance from SCROLLER containers left side
        var slidePos = Math.round(imageSlidesArray[i].offsetLeft + (fullSlideWidth / 2) );
        //current slides center position IN CONTAINER
        var slidePosIn = scrollPos - slidePos;
        //convert to percentage, this is the value to move images within slide right
        var slidePosPct = Math.round((slidePosIn / imageSliderWidth) * 100);
        //move image to center using 1/2 image width which is 50%
        slidePosPct = slidePosPct + 50;
        //finally... SLOW down image movement by cutting down slide pos percentage
        slidePosPct = slidePosPct * 0.20;
        imageSlidesArray[i].getElementsByTagName('img')[0].style.transform = 'translateX(' + slidePosPct + '%)';
      }
    }
  }
  imageSlider.addEventListener('scroll', slideAnimation);
  slideAnimation();
}; //EOF
//initialize image slider
window.addEventListener('load', imageSlider);
//initialize image slider if window resized or orientation change
window.addEventListener('onresize', imageSlider);
window.addEventListener('orientationchange', imageSlider);