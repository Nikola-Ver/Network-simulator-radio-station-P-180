const express = require("express");
const app = express();
const fs = require("fs");
const https = require("https");
const options = {
  key: fs.readFileSync("localhost.key"),
  cert: fs.readFileSync("localhost.crt"),
};
const server = https.createServer(options, app);
const io = require("socket.io")(server);

const port = 1000;
const propertys = process.argv;

let flagRecording = false;
if (propertys.length > 2 && propertys[2].toLowerCase() === "recording") {
  flagRecording = true;
  console.log("Сервер ведет аудиозапись");
}

app.use(express.static(__dirname.slice().replace(/\\[^\\]*$/, "")));

app.use("/", (req, res) => {
  res.redirect("/html/index.html");
});

io.on("connection", (socket) => {
  socket.on("stream", async (audio) => {
    socket.broadcast.emit("stream", audio);
  });

  if (flagRecording)
    socket.on("record", async (audio) => {
      if (!audio.beep && audio.audioChunks !== 0)
        socket.broadcast.emit("recording", {
          audioChunks: audio.audioChunks,
          frequency: audio.frequency,
        });
    });
});

console.log(`Сервер запущен на порте: ${port}`);
server.listen(port);
