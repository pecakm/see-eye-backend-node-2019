require("dotenv").config();
const http = require("http");
const https = require("https");
const fs = require("fs");
const app = require("./app");

if (process.env.PRODUCTION === "true") {
  const sslOptions = {
    key: fs.readFileSync("./key.pem"),
    cert: fs.readFileSync("./cert.pem")
  };

  https.createServer(sslOptions, app).listen(process.env.PORT);
} else {
  http.createServer(app).listen(process.env.PORT);
}
