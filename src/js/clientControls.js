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
    connectControlsButton.className = "connect_controls_button_close";
    divConnectControls.className = "connect_controls_block_open";
    statusConnectControls = false;
  } else {
    connectControlsButton.className = "connect_controls_button";
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
radiostationPowerButton.addEventListener("click", () => {
  turnRadiostation();
  processKey("");
});

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
  if (menuRadiostation.statusBattarey) {
    divBattarey.className = "radiostation_accum_not_active";
    menuRadiostation.battareyOff();
    menuRadiostation.broadcastingOff();
    menuRadiostation.stopWorking(); // import from radiostationMenu
  } else {
    divBattarey.className = "radiostation_accum_active";
    menuRadiostation.battareyOn();
  }
}

function antennaFunc() {
  if (menuRadiostation.statusAntenna) {
    divAntenna.className = "radiostation_antenna_not_active";
    menuRadiostation.antennaOff();
    menuRadiostation.broadcastingOff();
    menuRadiostation.antennaOff();
    menuRadiostation.antennaOff();
  } else {
    divAntenna.className = "radiostation_antenna_active";
    menuRadiostation.antennaOn();
    menuRadiostation.antennaOn();
  }
}

function headsetFunc() {
  if (menuRadiostation.statusHeadset) {
    divHeadset.className = "controls_call_broadcast_close";
    menuRadiostation.headsetOff();
  } else {
    divHeadset.className = "controls_call_broadcast_open";
    menuRadiostation.headsetOn();
  }
}

function turnRadiostation() {
  if (menuRadiostation.statusBattarey) {
    if (menuRadiostation.statusWorking) {
      menuRadiostation.stopWorking();
    } else {
      menuRadiostation.startWorking();
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

window.addEventListener("load", () => {
  const [loading] = document.getElementsByClassName("loading");
  loading.className = "loaded";
  document.body.className = "";
});

document.body.addEventListener("click", (e) => {
  const div = e.target.closest("div");
  if (!div && e.detail >= 3) {
    const newImg = prompt("Ссылка на новый фон", "Введите ссылку на новый фон");
    if (newImg.length !== 0) {
      document.body.style.setProperty(
        "--background",
        'url("' + newImg.replace("\\", "\\\\") + '") no-repeat'
      );
    }
  }
});
