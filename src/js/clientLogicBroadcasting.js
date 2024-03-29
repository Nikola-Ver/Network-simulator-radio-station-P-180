const socket = io();
const recordLength = 500;
const beepLength = 100;
const [broadcastButton] = document.getElementsByClassName('broadcast_button');
const [_broadcastButton] = document.getElementsByClassName('broadcast');
const [callButton] = document.getElementsByClassName('call');
const beep = new Audio('../music/beep.mp3');

const userFrequencysOut = new Array(16).fill(0);
const userFrequencysIn = new Array(16).fill(0);
const userModulation = new Array(16).fill(0);
const userChannelWidth = new Array(16).fill(0);
const userFrch = new Array(16).fill({
  tm: 255,
  typeOfCall: 0,
  numberOfCall: 1,
  group: 1,
  abonent: 1
});
const userPprch = new Array(16).fill({
  network: 1,
  tm: 255,
  typeOfCall: 0,
  numberOfCall: 1,
  group: 1,
  abonent: 1,
  pseudoKey: 0
});
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
      mediaRecorder.addEventListener('dataavailable', (event) => {
        radioEmit(data, event.data);
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

function checkChannel(stream) {
  return (
    userModulation[channel] !== -1 && (
      (
        stream.modulation < 2 &&
        stream.modulation === userModulation[channel] &&
        stream.frequency === userFrequencysIn[channel]) || (
        stream.modulation === 2 &&
        (stream.frch.tm === userFrch[channel].tm || stream.frch.tm === 0) && (
          stream.frequency === userFrequencysIn[channel] && (
            (stream.frch.typeOfCall === 0 &&
              stream.frch.numberOfCall === userFrch[channel].abonent) ||
            (stream.frch.typeOfCall === 1 &&
              stream.frch.numberOfCall === userFrch[channel].group) ||
            stream.frch.typeOfCall === 2)
        )
      ) || (
        stream.modulation === 3 &&
        (stream.pprch.tm === userPprch[channel].tm || stream.pprch.tm === 0) &&
        (stream.pprch.pseudoKey === userPprch[channel].pseudoKey) && (
          (stream.pprch.typeOfCall === 0 &&
            stream.pprch.numberOfCall === userPprch[channel].abonent) ||
          (stream.pprch.typeOfCall === 1 &&
            stream.pprch.numberOfCall === userPprch[channel].group) ||
          stream.pprch.typeOfCall === 2
        )
      )));
}

socket.on('stream', async (stream) => {
  if (
    !menuRadiostation.statusBroadcating &&
    menuRadiostation.statusWorking &&
    menuRadiostation.statusAntenna
  ) {
    if (checkChannel(stream))
      try {
        if (stream.beep) {
          if (!menuRadiostation.statusBeep) {
            beep.volume = menuRadiostation.volume / 24;
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
            audio.volume =
              (stream.speakVolume * menuRadiostation.volume) / (24 * 24);
            await audio.play();
          }
        }
      } catch { }
  }
});

function getTime(time) {
  let hours = String(Math.floor(time / (60 * 60 * 1000)));
  let minutes = String(Math.floor(time / (60 * 1000)) % 60);
  if (hours.length < 2) hours = '0' + hours;
  if (minutes.length < 2) minutes = '0' + minutes;
  return hours + ':' + minutes;
}

function getHoursMinutes(date) {
  let hours = String(date.getHours());
  let minutes = String(date.getMinutes());
  if (hours.length < 2) hours = "0" + hours;
  if (minutes.length < 2) minutes = "0" + minutes;
  return hours + ":" + minutes;
}

socket.on('recording', async (record) => {
  const [divParent] = document.getElementsByClassName('records_block');
  const block = document.createElement('div');
  const audioTag = document.createElement('audio');
  const text = document.createElement('p');
  const date = new Date();

  const audioBlob = new Blob(Array(record.audioChunks), {
    type: 'audio/mp3',
  });
  const audioUrl = URL.createObjectURL(audioBlob);
  audioTag.controls = true;
  audioTag.src = audioUrl;

  let modulation = '';
  if (record.modulation == 0) modulation = 'АМ';
  if (record.modulation == 1) modulation = 'ЧМ';
  if (record.modulation == 2) modulation = 'ФРЧ';
  if (record.modulation == 3) modulation = 'ППРЧ';

  if (record.modulation >= 0 && record.modulation <= 2) {
    text.textContent =
      getHoursMinutes(date) +
      ' (' +
      String((record.frequency + 2400) / 80) +
      'МГц) [' +
      modulation +
      ']:';
  } else {
    text.textContent =
      getHoursMinutes(date) + '[' +
      modulation +
      ']:';
  }

  block.className = 'audio_block';
  block.appendChild(text);
  block.appendChild(audioTag);
  divParent.appendChild(block);
});

(async () => {
  broadcastButton.addEventListener('touchstart', isBroadcasting);
  broadcastButton.addEventListener('touchend', isNotBroadcasting);
  _broadcastButton.addEventListener('touchstart', isBroadcasting);
  _broadcastButton.addEventListener('touchend', isNotBroadcasting);
  callButton.addEventListener('touchstart', isBroadcastingBeep);
  callButton.addEventListener('touchend', isNotBroadcastingBeep);

  broadcastButton.addEventListener('mousedown', isBroadcasting);
  broadcastButton.addEventListener('mouseup', isNotBroadcasting);
  _broadcastButton.addEventListener('mousedown', isBroadcasting);
  _broadcastButton.addEventListener('mouseup', isNotBroadcasting);
  callButton.addEventListener('mousedown', isBroadcastingBeep);
  callButton.addEventListener('mouseup', isNotBroadcastingBeep);

  const recorder = await recordAudio('stream');
  const record = await recordAudio('record');

  function isBroadcasting() {
    if (
      menuRadiostation.statusAntenna &&
      menuRadiostation.statusWorking &&
      !menuRadiostation.blocking
    ) {
      if (menuRadiostation.statusBeep) stopBeep();
      menuRadiostation.broadcastingOn();
      broadcasting();
    }
  }

  function isNotBroadcasting() {
    menuRadiostation.broadcastingOff();
  }

  menuRadiostation.isBroadcastingBeep = isBroadcastingBeep;
  menuRadiostation.isNotBroadcastingBeep = isNotBroadcastingBeep;

  function isBroadcastingBeep() {
    if (
      menuRadiostation.statusAntenna &&
      menuRadiostation.statusWorking &&
      !menuRadiostation.blocking
    ) {
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
      let flagBeep = true;
      if (!menuRadiostation.statusBroadcating) {
        flagBeep = false;
        radioEmit('stream', 0);
        clearInterval(interval);
      } else {
        radioEmit('stream', 0, true);
      }
    }, beepLength);
  }
})();

function radioEmit(typeOfData, audioChunks, beep = false) {
  if (userModulation[channel] === 2) {
    socket.emit(typeOfData, {
      audioChunks,
      frequency: userFrequencysOut[channel],
      beep,
      speakVolume: menuRadiostation.speakVolume,
      modulation: userModulation[channel],
      frch: userFrch[channel],
    });
  } else if (userModulation[channel] === 3) {
    socket.emit(typeOfData, {
      audioChunks,
      beep,
      speakVolume: menuRadiostation.speakVolume,
      modulation: userModulation[channel],
      pprch: userPprch[channel]
    });
  } else {
    socket.emit(typeOfData, {
      audioChunks,
      frequency: userFrequencysOut[channel],
      beep,
      speakVolume: menuRadiostation.speakVolume,
      modulation: userModulation[channel],
    });
  }
}