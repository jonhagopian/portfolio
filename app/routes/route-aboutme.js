var express = require("express");
var router = express.Router();

router.get("/about-me/", function(request, response) {

  var data = request.app.get('appData');
  var aboutAll = [];

  data.about_me.forEach(function(item) {
    aboutAll.push(item);
  });

  response.render("about-me", {
    pageTitle : "About Me",
    pageID : "aboutme",
    aboutAll : aboutAll
  });
});

module.exports = router;