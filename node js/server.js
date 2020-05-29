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
const arrayOfRecords = [];

let flagRecording = false;
if (propertys.length > 2 && propertys[2].toLowerCase() === "recording") {
  flagRecording = true;
  console.log("Сервер ведет аудиозапись");
}

app.use(express.static(__dirname.slice().replace(/\\[^\\]*$/, "")));
io.on("connection", (socket) => {
  socket.on("stream", async (audio) => {
    socket.broadcast.emit("stream", audio);

    if (flagRecording && !audio.beep && audio.audioChunks !== 0) {
      if (arrayOfRecords[audio.frequency] === undefined) {
        arrayOfRecords[audio.frequency] = [audio.audioChunks];
      } else {
        if (arrayOfRecords[audio.frequency].length >= 120) {
          socket.broadcast.emit("recording", {
            audioChunks: arrayOfRecords[audio.frequency],
            frequency: audio.frequency,
          });
          arrayOfRecords[audio.frequency].length = 0;
        } else {
          arrayOfRecords[audio.frequency].push(audio.audioChunks);
        }
      }
    }
  });
});

process.on("exit", function () {
  console.log("Сервер был выключен...");
});

process.on("SIGINT", function () {
  process.exit(0);
});

console.log(`Сервер запущен на порте: ${port}`);
server.listen(port);
