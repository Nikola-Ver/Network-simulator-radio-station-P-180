const socket = io();
const recordLength = 500;
const [broadcastButton] = document.getElementsByClassName("broadcast_button");
let chanel = 1;
let flagAlert = true;
let flagBroadcasting = true;

broadcastButton.addEventListener("touchstart", isBroadcasting);
broadcastButton.addEventListener("touchend", isNotBroadcasting);

function selectChanel() {
  chanel = Number(document.getElementById("chanel").value);
}

function isBroadcasting() {
  flagBroadcasting = true;
  broadcasting();
}

function isNotBroadcasting() {
  flagBroadcasting = false;
}

function recordAudio() {
  return new Promise((resolve) => {
    navigator.mediaDevices.getUserMedia =
      navigator.mediaDevices.getUserMedia ||
      navigator.mediaDevices.webkitGetUserMedia ||
      navigator.mediaDevices.mozGetUserMedia ||
      navigator.mediaDevices.msGetUserMedia;

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.addEventListener("dataavailable", (event) => {
        socket.emit("stream", {
          audioChunks: event.data,
          chanel,
        });
      });

      const start = () => {
        mediaRecorder.start();
      };

      const stop = () => {
        mediaRecorder.stop();
      };

      resolve({ start, stop });
    });
  });
}

socket.on("stream", async (stream) => {
  if (!flagBroadcasting)
    try {
      const audioBlob = new Blob(Array(stream.audioChunks));
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      await audio.play();
    } catch {
      if (flagAlert) {
        alert("Голосовая связь не поддерживается на данном устройстве");
        flagAlert = false;
      }
    }
});

async function broadcasting() {
  const recorder = await recordAudio();
  recorder.start();

  const interval = setInterval(async () => {
    await recorder.stop();
    if (!flagBroadcasting) clearInterval(interval);
    else await recorder.start();
  }, recordLength);
}

console.error = () => {};
