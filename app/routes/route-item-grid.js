var express = require("express");
var router = express.Router();

router.get("/portfolio", function(request, response) {
  var data = request.app.get('appData');
  var itemImages = [];
  var itemsAll = data.portfolio_projects;

  response.render("portfolio", {
    pageTitle : "Portfolio",
    pageID : "portfolio",
    items : itemsAll
  });
});

module.exports = router;