const socket = io();
const recordLength = 500;
const beepLength = 100;
const [broadcastButton] = document.getElementsByClassName("broadcast_button");
const [_broadcastButton] = document.getElementsByClassName("broadcast");
const [callButton] = document.getElementsByClassName("call");
const beep = new Audio("../music/beep.mp3");

let userFrequencysOut = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let userFrequencysIn = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let channel = 0;

function recordAudio(data) {
  return new Promise((resolve) => {
    navigator.mediaDevices.getUserMedia =
      navigator.mediaDevices.getUserMedia ||
      navigator.mediaDevices.webkitGetUserMedia ||
      navigator.mediaDevices.mozGetUserMedia ||
      navigator.mediaDevices.msGetUserMedia;

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.addEventListener("dataavailable", (event) => {
        socket.emit(data, {
          audioChunks: event.data,
          frequency: userFrequencysOut[channel],
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
  menuRadiostation.beepOff();
}

socket.on("stream", async (stream) => {
  if (
    !menuRadiostation.statusBroadcating &&
    menuRadiostation.statusWorking &&
    menuRadiostation.statusAntenna
  ) {
    if (stream.frequency === userFrequencysIn[channel])
      try {
        if (stream.beep) {
          if (!menuRadiostation.statusBeep) {
            beep.play();
            menuRadiostation.beepOn();
          } else {
            if (beep.currentTime > 595) beep.currentTime = 0.142821;
          }
        } else {
          if (menuRadiostation.statusBeep) {
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

  const audioBlob = new Blob(Array(record.audioChunks), {
    type: "audio/mp3",
  });
  const audioUrl = URL.createObjectURL(audioBlob);
  audioTag.controls = true;
  audioTag.src = audioUrl;

  text.textContent =
    getTime(date) + " (" + String((record.frequency + 2400) / 80) + "МГц):";

  block.className = "audio_block";
  block.appendChild(text);
  block.appendChild(audioTag);
  divParent.appendChild(block);
});

(async () => {
  broadcastButton.addEventListener("touchstart", isBroadcasting);
  broadcastButton.addEventListener("touchend", isNotBroadcasting);
  _broadcastButton.addEventListener("touchstart", isBroadcasting);
  _broadcastButton.addEventListener("touchend", isNotBroadcasting);
  callButton.addEventListener("touchstart", isBroadcastingBeep);
  callButton.addEventListener("touchend", isNotBroadcastingBeep);

  broadcastButton.addEventListener("mousedown", isBroadcasting);
  broadcastButton.addEventListener("mouseup", isNotBroadcasting);
  _broadcastButton.addEventListener("mousedown", isBroadcasting);
  _broadcastButton.addEventListener("mouseup", isNotBroadcasting);
  callButton.addEventListener("mousedown", isBroadcastingBeep);
  callButton.addEventListener("mouseup", isNotBroadcastingBeep);

  const recorder = await recordAudio("stream");
  const record = await recordAudio("record");

  function isBroadcasting() {
    if (menuRadiostation.statusAntenna && menuRadiostation.statusWorking) {
      if (menuRadiostation.statusBeep) stopBeep();
      menuRadiostation.broadcastingOn();
      broadcasting();
    }
  }

  function isNotBroadcasting() {
    menuRadiostation.broadcastingOff();
  }

  function isBroadcastingBeep() {
    if (menuRadiostation.statusAntenna && menuRadiostation.statusWorking) {
      if (menuRadiostation.statusBeep) stopBeep();
      menuRadiostation.broadcastingOn();
      broadcastingBeep();
    }
  }

  function isNotBroadcastingBeep() {
    menuRadiostation.broadcastingOff();
  }

  function broadcasting() {
    if (menuRadiostation.statusBroadcating) {
      recorder.start();
      record.start();

      const interval = setInterval(async () => {
        await recorder.stop();
        if (!menuRadiostation.statusBroadcating) {
          clearInterval(interval);
          await record.stop();
        } else await recorder.start();
      }, recordLength);
    }
  }

  function broadcastingBeep() {
    const interval = setInterval(async () => {
      if (!menuRadiostation.statusBroadcating) {
        socket.emit("stream", {
          audioChunks: 0,
          frequency: userFrequencysOut[channel],
          beep: false,
        });
        clearInterval(interval);
      } else
        socket.emit("stream", {
          audioChunks: 0,
          frequency: userFrequencysOut[channel],
          beep: true,
        });
    }, beepLength);
  }
})();

console.error = () => {};
