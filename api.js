
var express = require("express");
var bodyParser = require("body-parser");
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Define the App path
var routes = require("./routes/routes.js")(app);
// Start the Server 
var server = app.listen(8080, function () {
     console.log("start Listening on port %s...", server.address().port);
});