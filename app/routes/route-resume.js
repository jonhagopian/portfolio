var express = require("express");
var router = express.Router();

router.get("/resume/", function(request, response) {
  response.render("resume", {
    pageTitle : "Resume",
    pageID : "resume"
  });
});

module.exports = router;