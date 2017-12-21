var express = require("express");
var router = express.Router();

router.get("/portfolio", function(request, response) {
  var data = request.app.get('appData');
  var itemsAll = data.portfolio_projects;

  response.render("items-category", {
    pageTitle : "Portfolio",
    pageID : "items-list",
    itemsAll : itemsAll
  });
});

module.exports = router;