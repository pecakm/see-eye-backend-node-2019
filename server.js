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
    socket.on("room", function(data) {
      socket.join(data);
    });
    socket.on("chat_message", function(data) {
      socket.to(data.room).broadcast.emit("chat_message", data.message);
    });
  });

  server.listen(process.env.PORT);
}