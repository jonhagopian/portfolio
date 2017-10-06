var express = require("express");
var reload = require("reload"); // auto browser reload module, use for local testing

var app = express();

app.set("port", process.env.PORT || 3000)
app.set("view engine", "ejs");
app.set("views", "app/views");

app.use(express.static('app/resources'));

// Global Variables
app.locals.siteTitle = "Jon Hagopian:: ";

// Set Routes
app.use(require('./routes/route-index'));

var server = app.listen(app.get('port'), function() {
  console.log('Listening on port ' + app.get('port'));
});

// start reload for testing local
reload(app);