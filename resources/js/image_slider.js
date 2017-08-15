function imageSlider() {
  var box = document.getElementById('image_slider');
  var s0 = box.getElementsByTagName('div')[0];
  var sW = s0.offsetWidth;
  var sF = sW + parseInt(getComputedStyle(s0).marginRight);
  var sArr = document.getElementsByClassName('image_slide');
  function sAnimate() {
    var boxW = box.offsetWidth;
    var scrPos = box.scrollLeft;
    if (sF * (sArr.length - 1) <= boxW ) {
      image_slider.setAttribute('class','justified');
    } else {
      for (var i = 0; i < sArr.length; i++) {
        var sPos = Math.round(sArr[i].offsetLeft + (sF / 2) );
        var sPosVis = scrPos - sPos;
        var sPosPct = Math.round((sPosVis / boxW) * 100);
        sPosPct = sPosPct + 50;
        sPosPct = sPosPct * 0.20; // slow image movement by reducing this %
        sArr[i].getElementsByTagName('img')[0].style.transform = 'translateX(' + sPosPct + '%)';
      }
    }
  }
  box.addEventListener('scroll', sAnimate);
  sAnimate();
}; //EOF
//init slider
window.addEventListener('load', imageSlider);
//re-init slider
window.addEventListener('resize', imageSlider);
window.addEventListener('orientationchange', imageSlider);