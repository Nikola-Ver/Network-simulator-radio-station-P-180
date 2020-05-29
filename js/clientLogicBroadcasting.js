const socket = io();
const recordLength = 500;
const beepLength = 100;
const [broadcastButton] = document.getElementsByClassName("broadcast_button");
const [_broadcastButton] = document.getElementsByClassName("broadcast");
const [callButton] = document.getElementsByClassName("call");
const beep = new Audio("../music/beep.mp3");

let userFrequencys = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let chanel = 0;
let flagBroadcasting = false;
let flagBeepNow = false;
broadcasting();

let flagBattarey = false;
let flagAntenna = false;
let flagHeadset = false;
let flagTurnOn = false;

broadcastButton.addEventListener("touchstart", isBroadcasting);
broadcastButton.addEventListener("touchend", isNotBroadcasting);
_broadcastButton.addEventListener("touchstart", isBroadcasting);
_broadcastButton.addEventListener("touchend", isNotBroadcasting);
callButton.addEventListener("touchstart", isBroadcastingBeep);
callButton.addEventListener("touchend", isNotBroadcastingBeep);

function selectChanel() {
  chanel = Number(document.getElementById("chanel").value);
}

function isBroadcasting() {
  if (flagAntenna && flagTurnOn) {
    if (flagBeepNow) stopBeep();
    flagBroadcasting = true;
    broadcasting();
  }
}

function isNotBroadcasting() {
  flagBroadcasting = false;
}

function isBroadcastingBeep() {
  if (flagAntenna && flagTurnOn) {
    if (flagBeepNow) stopBeep();
    flagBroadcasting = true;
    broadcastingBeep();
  }
}

function isNotBroadcastingBeep() {
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
          frequency: userFrequencys[chanel],
          beep: false,
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

function stopBeep() {
  beep.pause();
  beep.currentTime = 0;
  flagBeepNow = false;
}

socket.on("stream", async (stream) => {
  if (!flagBroadcasting && flagAntenna && flagTurnOn) {
    if (stream.frequency === userFrequencys[chanel])
      try {
        if (stream.beep) {
          if (!flagBeepNow) {
            beep.play();
            flagBeepNow = true;
          } else {
            if (beep.currentTime > 595) beep.currentTime = 0.142821;
          }
        } else {
          if (flagBeepNow) {
            stopBeep();
          } else {
            const audioBlob = new Blob(Array(stream.audioChunks));
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            await audio.play();
          }
        }
      } catch {}
  }
});

function getTime(date) {
  let hours = String(date.getHours());
  let minutes = String(date.getMinutes());
  if (hours.length < 2) hours = "0" + hours;
  if (minutes.length < 2) minutes = "0" + minutes;
  return hours + ":" + minutes;
}

socket.on("recording", async (record) => {
  const [divParent] = document.getElementsByClassName("records_block");
  const block = document.createElement("div");
  const audioTag = document.createElement("audio");
  const text = document.createElement("p");
  const date = new Date();

  const audioBlob = new Blob(record.audioChunks, { type: "audio/mp3" });
  const audioUrl = URL.createObjectURL(audioBlob);
  audioTag.controls = true;
  audioTag.src = audioUrl;

  text.textContent = getTime(date) + " (" + String(record.frequency) + "МГц):";

  block.className = "audio_block";
  block.appendChild(text);
  block.appendChild(audioTag);
  divParent.appendChild(block);
});

async function broadcasting() {
  const recorder = await recordAudio();
  if (flagBroadcasting) {
    recorder.start();

    const interval = setInterval(async () => {
      await recorder.stop();
      if (!flagBroadcasting) clearInterval(interval);
      else await recorder.start();
    }, recordLength);
  }
}

function broadcastingBeep() {
  const interval = setInterval(async () => {
    if (!flagBroadcasting) {
      socket.emit("stream", {
        audioChunks: 0,
        frequency: userFrequencys[chanel],
        beep: false,
      });
      clearInterval(interval);
    } else
      socket.emit("stream", {
        audioChunks: 0,
        frequency: userFrequencys[chanel],
        beep: true,
      });
  }, beepLength);
}

console.error = () => {};
