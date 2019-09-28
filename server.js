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
    socket.on("chat_room", function(roomId) {
      socket.join(roomId);
      socket.to(roomId).broadcast.emit("chat_online");
    });
    socket.on("chat_key", function(data) {
      socket.to(data.roomId).broadcast.emit("chat_key", {
        key: data.key,
        chatItems: data.chatItems
      });
    });
    socket.on("chat_message", function(data) {
      socket.to(data.roomId).broadcast.emit("chat_message", data.message);
    });
  });

  server.listen(process.env.PORT);
}