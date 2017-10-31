var express = require("express");
var router = express.Router();

router.get("/", function(request, response) {
  response.render("index", {
    pageTitle : "Home",
    pageID : "home"
  });
});

module.exports = router;