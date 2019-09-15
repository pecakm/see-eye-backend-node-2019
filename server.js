require("dotenv").config();
const http = require("http");
const https = require("https");
const fs = require("fs");
const app = require("./app");
const io = require("socket.io");

if (process.env.PRODUCTION === "true") {
  const sslOptions = {
    key: fs.readFileSync("./key.pem"),
    cert: fs.readFileSync("./cert.pem")
  };

  runServer(https.createServer(sslOptions, app));
} else {
  runServer(http.createServer(app));
}

function runServer(server) {
  io(server).on("connection", function(socket) {
    console.log("a user connected");
    socket.on("disconnect", function() {
      console.log("user disconnected");
    });
  });

  server.listen(process.env.PORT);
}