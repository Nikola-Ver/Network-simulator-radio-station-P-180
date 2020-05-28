const socket = io();
const recordLength = 500;
const [broadcastButton] = document.getElementsByClassName("broadcast_button");
const [_broadcastButton] = document.getElementsByClassName("broadcast");

let userFrequencys = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let chanel = 1;
let flagAlert = true;
let flagBroadcasting = false;
broadcasting();

let flagBattarey = false;
let flagAntenna = false;
let flagHeadset = false;
let flagTurnOn = false;

broadcastButton.addEventListener("touchstart", isBroadcasting);
broadcastButton.addEventListener("touchend", isNotBroadcasting);
_broadcastButton.addEventListener("touchstart", isBroadcasting);
_broadcastButton.addEventListener("touchend", isNotBroadcasting);

function selectChanel() {
  chanel = Number(document.getElementById("chanel").value);
}

function isBroadcasting() {
  if (flagAntenna && flagTurnOn) {
    flagBroadcasting = true;
    broadcasting();
  }
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
          chanel: userFrequencys[chanel],
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
  if (!flagBroadcasting && flagAntenna && flagTurnOn)
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

const [radiostationPowerButton] = document.getElementsByClassName(
  "radiostation_power_button"
);
const [battareyButton] = document.getElementsByClassName("battery_button");
const [antennaButton] = document.getElementsByClassName("antenna_button");
const [headsetButton] = document.getElementsByClassName("headset_button");
const [radiostationAntennaButton] = document.getElementsByClassName(
  "radiostation_antenna_not_active"
);
const [radiostationAccumButton] = document.getElementsByClassName(
  "radiostation_accum_not_active"
);

battareyButton.addEventListener("click", battareyFunc);
antennaButton.addEventListener("click", antennaFunc);
headsetButton.addEventListener("click", headsetFunc);
radiostationAccumButton.addEventListener("click", battareyFunc);
radiostationAntennaButton.addEventListener("click", antennaFunc);
radiostationPowerButton.addEventListener("click", turnRadiostation);

const [divBattarey] = document.getElementsByClassName(
  "radiostation_accum_not_active"
);
const [divAntenna] = document.getElementsByClassName(
  "radiostation_antenna_not_active"
);
const [divHeadset] = document.getElementsByClassName(
  "controls_call_broadcast_close"
);

function battareyFunc() {
  if (flagBattarey) {
    divBattarey.className = "radiostation_accum_not_active";
    flagBattarey = false;
    flagTurnOn = false;
    flagBroadcasting = false;
  } else {
    divBattarey.className = "radiostation_accum_active";
    flagBattarey = true;
  }
}

function antennaFunc() {
  if (flagAntenna) {
    divAntenna.className = "radiostation_antenna_not_active";
    flagAntenna = false;
    flagBroadcasting = false;
  } else {
    divAntenna.className = "radiostation_antenna_active";
    flagAntenna = true;
  }
}

function headsetFunc() {
  if (flagHeadset) {
    divHeadset.className = "controls_call_broadcast_close";
    flagHeadset = false;
  } else {
    divHeadset.className = "controls_call_broadcast_open";
    flagHeadset = true;
  }
}

function turnRadiostation() {
  if (flagBattarey) {
    if (flagTurnOn) {
      flagTurnOn = false;
    } else {
      flagTurnOn = true;
    }
  }
}

console.error = () => {};
