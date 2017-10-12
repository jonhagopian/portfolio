var express = require("express");
var router = express.Router();

router.get("/projects/:itemid", function(request, response) {
  var data = request.app.get('appData');
  var itemAll = [];

  data.portfolio_projects.forEach(function(item) {
    if (item.shortname == request.params.itemid) {
      itemAll.push(item);
    }
  });

  response.render("item", {
    pageTitle : "Detail",
    pageID : "item-detail",
    itemAll : itemAll
  });
});

module.exports = router;