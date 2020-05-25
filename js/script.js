let devices = { audio: true, video: false };

navigator.mediaDevices.getUserMedia(devices).then(run);

function run(stream) {
  let [audio] = document.getElementsByTagName("audio");
  audio.srcObject = stream;
  audio.play();
}
