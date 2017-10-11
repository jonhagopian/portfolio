var express = require("express");
var reload = require("reload"); // auto browser reload module, use for local testing
var dataFile = require('./data/data.json');

var app = express();

app.set("port", process.env.PORT || 3000)
app.set("appData", dataFile)
app.set("view engine", "ejs");
app.set("views", "app/views");

app.use(express.static('app/resources'));

// Variables
app.locals.siteTitle = "Jon Hagopian:: ";
app.locals.hdrImgArr = dataFile.header_images;
app.locals.projectsArr = dataFile.portfolio_projects;

// Set Resources Domain testing/development (prod)
if (app.get("env") === "development" || app.get("env") === "production") {
  app.locals.defaultResources = "http://d27uh45wmyq0ww.cloudfront.net";
} else if (app.get("env") === "testing") {
  console.log("In Local Testing Environment");
  app.locals.defaultResources = "";
  reload(app); // start reload for testing local
}

// Set Routes
app.use(require('./routes/route-index'));
app.use(require('./routes/route-item-grid'));
app.use(require('./routes/route-item'));

var server = app.listen(app.get('port'), function() {
  console.log('Listening on port ' + app.get('port'));
});