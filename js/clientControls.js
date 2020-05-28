const [controlsButton] = document.getElementsByClassName("open_controls_block");
const [div] = document.getElementsByClassName("controls_close");

controlsButton.addEventListener("click", openOrCloseControls);

function openOrCloseControls() {
  if (controlsButton.className === "open_controls_block") {
    controlsButton.className = "close_controls_block";
    div.className = "controls_open";
  } else {
    controlsButton.className = "open_controls_block";
    div.className = "controls_close";
  }
}
