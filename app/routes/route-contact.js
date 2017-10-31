var express = require("express");
var router = express.Router();

router.get("/contact/", function(request, response) {
  response.render("contact", {
    pageTitle : "Contact Form",
    pageID : "contact",
    pageVer : ""
  });
});

router.get("/contact/thankyou", function(request, response) {
  response.render("contact", {
    pageTitle : "Contact Form: Thank You.",
    pageID : "contact",
    pageVer : "thankyou"
  });
});

module.exports = router;