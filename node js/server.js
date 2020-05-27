const express = require("express");
const app = express();
const fs = require("fs");
const https = require("https");
const port = 1000;
var options = {
  key: fs.readFileSync("localhost.key"),
  cert: fs.readFileSync("localhost.crt"),
};
let server = https.createServer(options, app);
const io = require("socket.io")(server);

app.use(express.static(__dirname.slice().replace(/\\[^\\]*$/, "")));
io.on("connection", (socket) => {
  socket.on("stream", async (audio) => {
    socket.broadcast.emit("stream", audio);
  });
});

console.log(`Сервер запущен на порте: ${port}`);
server.listen(port);
