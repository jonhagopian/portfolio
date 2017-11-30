var express = require("express");
var reload = require("reload"); // auto browser reload module, use for local testing
var nodemailer = require("nodemailer");
var dataFile = require('./data/data.json');

var app = express();

app.set("port", process.env.PORT || 3000)
app.set("appData", dataFile)
app.set("view engine", "ejs");
app.set("views", "app/views");
app.set("json spaces", 2); // pretty print

app.use(express.static('app/resources'));

// Variables
app.locals.siteTitle = "Jon Hagopian:: ";
app.locals.hdrImgArr = dataFile.header_images;
app.locals.projectsArr = dataFile.portfolio_projects;

// Set Resources Domain testing/development (prod)
if (app.get("env") === "development" || app.get("env") === "production") {
  app.locals.defaultResources = "http://d27uh45wmyq0ww.cloudfront.net";
  app.locals.emailGetURL = "/send";
} else if (app.get("env") === "testing") {
  console.log("In Local Testing Environment");
  app.locals.defaultResources = "";
  app.locals.emailGetURL = "/send";
  reload(app); // start reload for testing local
}

// Email
messageEmail = "";
var smtpTransport = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  auth: {
    user: "jon.hagopian",
    pass: "extra3924"
  }
});
app.get("/send", function(request, response) {
  var mailOptions = {
    to : "jon.hagopian@gmail.com",
    name : request.query.name,
    from : request.query.from,
    subject : request.query.subject,
    text : request.query.message + "\n\n From:" + request.query.name +  request.query.from,
    html : `<p>Sent via jonhagopian.com</p>
    <p><b>Message:</b> ${request.query.message}</p>
    <p><b>From:</b> ${request.query.name} <<a href="mailto:${request.query.from}">${request.query.from}</a>></p>`
  }
  console.log(mailOptions);
  smtpTransport.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Message ID: " + info.messageId);
      console.log(info.envelope);
      messageEmail = mailOptions.text;
      response.redirect("/contact/thankyou");
    }
  });
});

// Set Routes
app.use(require("./routes/route-index"));
app.use(require("./routes/route-resume"));
app.use(require("./routes/route-contact"));
app.use(require("./routes/route-aboutme"));
app.use(require("./routes/route-aboutsite"));
app.use(require("./routes/route-item-grid"));
app.use(require("./routes/route-item"));

var server = app.listen(app.get('port'), function() {
  console.log('Listening on port ' + app.get('port'));
});