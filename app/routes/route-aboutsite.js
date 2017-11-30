var express = require("express");
var router = express.Router();

router.get("/about-site/", function(request, response) {

  var data = request.app.get('appData');
  var aboutsiteAll = [];

  data.about_site.forEach(function(item) {
    aboutsiteAll.push(item);
  });

  response.render("about-site", {
    pageTitle : "About this Site",
    pageID : "aboutsite",
    aboutsiteAll : aboutsiteAll
  });
});

module.exports = router;