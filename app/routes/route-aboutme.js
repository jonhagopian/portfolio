var express = require("express");
var router = express.Router();

router.get("/about-me/", function(request, response) {
  response.render("about-me", {
    pageTitle : "About Me",
    pageID : "aboutme"
  });
});

module.exports = router;