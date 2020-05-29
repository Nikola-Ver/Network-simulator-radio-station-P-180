//import clientLogicBroadcasting
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

const [recordsButton] = document.getElementsByClassName("records_button");
const [recordsBlock] = document.getElementsByClassName(
  "records_block_not_active"
);
let flagRecordsBlock = false;

recordsButton.addEventListener("click", openOrCloseRecords);

function openOrCloseRecords() {
  if (flagRecordsBlock) {
    recordsBlock.className = "records_block_not_active";
    recordsButton.className = "records_button";
    flagRecordsBlock = false;
  } else {
    recordsButton.className = "records_button_close";
    recordsBlock.className = "records_block_active";
    flagRecordsBlock = true;
  }
}
