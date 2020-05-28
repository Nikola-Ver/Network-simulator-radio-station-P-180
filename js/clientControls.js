const [controlsButton] = document.getElementsByClassName(
  "open_controls_button"
);
const [divControls] = document.getElementsByClassName("controls_close");
controlsButton.addEventListener("click", openOrCloseControls);

function openOrCloseControls() {
  if (controlsButton.className === "open_controls_button") {
    controlsButton.className = "close_controls_button";
    divControls.className = "controls_open";
  } else {
    controlsButton.className = "open_controls_button";
    divControls.className = "controls_close";
  }
}

const [connectControlsButton] = document.getElementsByClassName(
  "connect_controls_button"
);
const [divConnectControls] = document.getElementsByClassName(
  "connect_controls_block_close"
);
let statusConnectControls = true;
connectControlsButton.addEventListener("click", openOrCloseConnectControls);

function openOrCloseConnectControls() {
  if (statusConnectControls) {
    divConnectControls.className = "connect_controls_block_open";
    statusConnectControls = false;
  } else {
    divConnectControls.className = "connect_controls_block_close";
    statusConnectControls = true;
  }
}
