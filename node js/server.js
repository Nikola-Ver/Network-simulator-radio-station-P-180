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
let timeRecords = 60;
if (propertys.length > 2 && propertys[2].toLowerCase() === "recording") {
  flagRecording = true;
  if (propertys.length > 3 && !isNaN(Number(propertys[3]))) {
    timeRecords = Number(propertys[3]);
  }
  console.log(
    "Сервер ведет аудиозапись. Длина записей: " + String(timeRecords / 2) + "с."
  );
}

app.use(express.static(__dirname.slice().replace(/\\[^\\]*$/, "")));

app.use("/", (req, res) => {
  res.redirect("/html/index.html");
});

io.on("connection", (socket) => {
  socket.on("stream", async (audio) => {
    socket.broadcast.emit("stream", audio);

    if (flagRecording && !audio.beep && audio.audioChunks !== 0) {
      if (arrayOfRecords[audio.frequency] === undefined) {
        arrayOfRecords[audio.frequency] = [audio.audioChunks];
      } else {
        if (arrayOfRecords[audio.frequency].length >= timeRecords) {
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

console.log(`Сервер запущен на порте: ${port}`);
server.listen(port);
