const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const port = 1000;

app.use(express.static(__dirname.slice().replace(/\\[^\\]*$/, "")));
io.on("connection", (socket) => {
  socket.on("stream", async (audio) => {
    socket.broadcast.emit("stream", audio);
  });
});

console.log(`Сервер запущен на порте: ${port}`);
server.listen(port);
