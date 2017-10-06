var express = require('express');
var router = express.Router();

router.get('/', function(request, response) {
	//var headerImgs = request.app.get("headerImgs");

//  var data = request.app.get('appData');
//  data.whatData.forEach(function(item) {
//    var = var.concat(who.what);
//  });

  response.render('index', {
    pageTitle: 'Home',
    pageID: 'home'
  });

});

module.exports = router;