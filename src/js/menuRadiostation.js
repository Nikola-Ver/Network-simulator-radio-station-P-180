const [rightButtonChannel] = document.getElementsByClassName("arrow_right");
const [leftButtonChannel] = document.getElementsByClassName("arrow_left");

rightButtonChannel.addEventListener("click", () => {
  if (channel > 0) channel--;
  if (channel < 9)
    menuRadiostation.divChannel.textContent = "0" + String(channel + 1);
  else menuRadiostation.divChannel.textContent = channel + 1;
  menuRadiostation.setFrequency();
});

leftButtonChannel.addEventListener("click", () => {
  if (channel < 15) channel++;
  if (channel < 9)
    menuRadiostation.divChannel.textContent = "0" + String(channel + 1);
  else menuRadiostation.divChannel.textContent = channel + 1;
  menuRadiostation.setFrequency();
});

const buttonOK = document.getElementById("button_ok");
const buttonMenu = document.getElementById("button_menu");
const buttonCancel = document.getElementById("button_cancel");
const button0 = document.getElementById("button_0");
const button1 = document.getElementById("button_1");
const button2 = document.getElementById("button_2");
const button3 = document.getElementById("button_3");
const button4 = document.getElementById("button_4");
const button5 = document.getElementById("button_5");
const button6 = document.getElementById("button_6");
const button7 = document.getElementById("button_7");
const button8 = document.getElementById("button_8");
const button9 = document.getElementById("button_9");
const buttonLattice = document.getElementById("button_lattice");
const buttonStar = document.getElementById("button_star");

buttonOK.addEventListener("click", () => {
  processKey("Enter");
});
buttonMenu.addEventListener("click", () => {
  processKey("KeyM");
});
buttonCancel.addEventListener("click", () => {
  processKey("Escape");
});
button0.addEventListener("click", () => {
  processKey("Digit0");
});
button1.addEventListener("click", () => {
  processKey("Digit1");
});
button2.addEventListener("click", () => {
  processKey("Digit2");
});
button3.addEventListener("click", () => {
  processKey("Digit3");
});
button3.addEventListener("mousedown", () => {
  if (menuRadiostation.currentMenu === 0) menuRadiostation.isBroadcastingBeep();
});
button3.addEventListener("mouseup", () => {
  if (menuRadiostation.statusBroadcating)
    menuRadiostation.isNotBroadcastingBeep();
});
button3.addEventListener("touchstart", () => {
  if (menuRadiostation.currentMenu === 0) menuRadiostation.isBroadcastingBeep();
});
button3.addEventListener("touchend", () => {
  if (menuRadiostation.statusBroadcating)
    menuRadiostation.isNotBroadcastingBeep();
});
button4.addEventListener("click", () => {
  processKey("Digit4");
});
button5.addEventListener("click", () => {
  processKey("Digit5");
});
button6.addEventListener("click", () => {
  processKey("Digit6");
});
button7.addEventListener("click", () => {
  processKey("Digit7");
});
button8.addEventListener("click", () => {
  processKey("Digit8");
});
button9.addEventListener("click", () => {
  processKey("Digit9");
});
buttonLattice.addEventListener("click", () => {
  processKey("NumpadDivide");
});
buttonStar.addEventListener("click", () => {
  processKey("NumpadMultiply");
});

document.addEventListener("keydown", (e) => {
  processKey(e.code);
});

function processKey(keyCode) {
  if (menuRadiostation.statusWorking) {
    keyCode = keyCode.replace(/Numpad(?=[0-9])/gi, "Digit");
    keyCode = keyCode.replace("NumpadEnter", "Enter");
    const currentPosition = menu(
      menuRadiostation.currentMenu,
      menuRadiostation.position,
      keyCode
    );

    if (currentPosition) {
      menuRadiostation.position = currentPosition.position;

      if (currentPosition.currentMenu !== menuRadiostation.currentMenu) {
        menuImplementation.closeCurrentMenu();
        menuImplementation.showMenu(currentPosition.currentMenu);
        menuRadiostation.currentMenu = currentPosition.currentMenu;

        if (menuRadiostation.currentMenu === 1 && menuRadiostation.blocking)
          menuRadiostation.position = 1;
        else menuRadiostation.position = 0;
      }
    }
  }
}

const menuRadiostation = {
  passwordSetting: "0000",
  displayTimer: null,
  frequencyCallFlag: true,
  lightKeyboard: false,
  blocking: true,
  statusWorking: false,
  statusHeadset: false,
  statusAntenna: false,
  statusBattarey: false,
  statusBroadcating: false,
  statusBeep: false,
  statusTime: false,
  prevPower: 2,
  position: 0,
  speakVolume: 24,
  volume: 24,
  currentMenu: 0,
  listOfMenu: document.getElementById("active_zone").children,
  listOfMenuElements: [
    document.getElementById("top_block"),
    document.getElementById("active_zone"),
    document.getElementById("bottom_block"),
  ],
  divTime: document.getElementsByClassName("time")[0],
  divChannel: document.getElementById("bottom_text_channel"),

  startWorking() {
    menuImplementation.showStartMenu();
    menuImplementation.startTime();
    this.statusWorking = true;
  },

  stopWorking() {
    menuImplementation.stopTime();
    menuImplementation.shutDown();
    this.block();
    this.statusWorking = false;
  },

  isBroadcastingBeep() {},
  isNotBroadcastingBeep() {},

  setVolumeImg(degree) {
    if (degree === 0)
      document
        .getElementsByClassName("sound_type")[0]
        .style.setProperty(
          "--sound_type_img",
          'url("../img/mute.png") no-repeat'
        );
    else if (this.statusHeadset)
      document
        .getElementsByClassName("sound_type")[0]
        .style.setProperty(
          "--sound_type_img",
          'url("../img/headset.png") no-repeat'
        );
    else
      document
        .getElementsByClassName("sound_type")[0]
        .style.setProperty(
          "--sound_type_img",
          'url("../img/speaker.png") no-repeat'
        );
  },

  setTimerDisplay(time) {
    this.displayTimer = time;
    return setTimeout(() => {
      menuImplementation.shutDownDisplay();
    }, time * 1000);
  },

  clearTimerDisplay(timer) {
    this.displayTimer = null;
    clearTimeout(timer);
    return null;
  },

  block() {
    let divCollection = document.getElementById("main_menu").children;
    divCollection[1].id = "block";
    divCollection[0].id = "";
    divCollection[2].id = "current_position";
    document
      .getElementsByClassName("key")[0]
      .style.setProperty("--key_img", 'url("../img/key.png") no-repeat');

    divCollection = document.getElementById("access_menu").children;
    divCollection[4].id = "block";
    divCollection = document.getElementById("frequency_call");
    divCollection.className = "not_active";

    this.blocking = true;
  },

  unblock() {
    let divCollection = document.getElementById("main_menu").children;
    divCollection[0].id = "";
    divCollection[1].id = "current_position";
    divCollection[2].id = "";
    document
      .getElementsByClassName("key")[0]
      .style.setProperty("--key_img", "transparent");

    divCollection = document.getElementById("access_menu").children;
    divCollection[4].id = "";
    divCollection = document.getElementById("frequency_call");
    divCollection.className = "block_channel";
    this.setFrequency();

    this.blocking = false;
  },

  lightKeyboardOn() {
    let divCollection = document.getElementsByClassName("radiostation_button");
    let lengthDiv = divCollection.length;
    for (let i = 0; i < lengthDiv; i++) {
      divCollection[0].className = "radiostation_button_light";
    }

    this.lightKeyboard = true;
  },

  lightKeyboardOff() {
    flagLightKeyboard = false;
    let divCollection = document.getElementsByClassName(
      "radiostation_button_light"
    );
    let lengthDiv = divCollection.length;
    for (let i = 0; i < lengthDiv; i++) {
      divCollection[0].className = "radiostation_button";
    }

    this.lightKeyboard = false;
  },

  headsetOn() {
    document
      .getElementsByClassName("sound_type")[0]
      .style.setProperty(
        "--sound_type_img",
        'url("../img/headset.png") no-repeat'
      );
    this.statusHeadset = true;
  },

  headsetOff() {
    if (this.volume > 0) {
      document
        .getElementsByClassName("sound_type")[0]
        .style.setProperty(
          "--sound_type_img",
          'url("../img/speaker.png") no-repeat'
        );
    } else {
      document
        .getElementsByClassName("sound_type")[0]
        .style.setProperty(
          "--sound_type_img",
          'url("../img/mute.png") no-repeat'
        );
    }
    this.statusHeadset = false;
  },

  antennaOn() {
    document
      .getElementsByClassName("network")[0]
      .style.setProperty(
        "--network_img",
        'url("../img/network.png") no-repeat'
      );
    this.statusAntenna = true;
  },

  antennaOff() {
    document
      .getElementsByClassName("network")[0]
      .style.setProperty(
        "--network_img",
        'url("../img/no_network.png") no-repeat'
      );
    this.statusAntenna = false;
  },

  battareyOn() {
    this.statusBattarey = true;
  },

  battareyOff() {
    menuImplementation.stopTime();
    menuImplementation.shutDown();
    this.statusBattarey = false;
  },

  broadcastingOn() {
    this.statusBroadcating = true;
  },

  broadcastingOff() {
    this.statusBroadcating = false;
  },

  beepOn() {
    this.statusBeep = true;
  },

  beepOff() {
    this.statusBeep = false;
  },

  setPower(degree) {
    let [divPowerImg] = document.getElementsByClassName("power");
    if (degree === 3) degree = this.prevPower;
    if (degree > 1) {
      divPowerImg.style.setProperty(
        "--power_img",
        'url("../img/max_power.png") no-repeat'
      );
      this.prevPower = 1;
    } else {
      divPowerImg.style.setProperty(
        "--power_img",
        'url("../img/nominal_power.png") no-repeat'
      );
      this.prevPower = 2;
    }
  },

  setFrequency() {
    let divFrequency = document.getElementById("bottom_text_frequency");
    if (this.frequencyCallFlag) {
      divFrequency.textContent = getTextFrequency(userFrequencysOut[channel]);
    } else {
      divFrequency.textContent = getTextFrequency(userFrequencysIn[channel]);
    }
  },
};

const menuImplementation = {
  timeInterval: null,

  showStartMenu() {
    menuImplementation.closeCurrentMenu();
    menuRadiostation.listOfMenuElements.forEach((e) => {
      e.className = "active";
    });
    menuRadiostation.currentMenu = 0;
    menuRadiostation.listOfMenu[0].className = "active";
    this.changeTextButton("", "МЕНЮ", "");
    if (channel < 9)
      menuRadiostation.divChannel.textContent = "0" + String(channel + 1);
    else menuRadiostation.divChannel.textContent = channel + 1;
  },

  showMenu(codeMenu) {
    menuRadiostation.listOfMenu[codeMenu].className = "active";
    switch (codeMenu) {
      case 0:
        this.changeTextButton("", "МЕНЮ", "");
        break;

      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 10:
      case 11:
        this.changeTextButton("Выбор", "", "Выход");
        break;

      case 6:
      case 7:
      case 8:
      case 22:
        this.changeTextButton("", "", "Выход");
        break;

      case 12:
        this.changeTextButton("Ввод", "", "Отмена");
        break;

      case 9:
      case 13:
      case 14:
      case 15:
      case 21:
        this.changeTextButton("Да", "", "Нет");
        break;

      case 16:
        this.changeTextButton("", "Итог", "След.");
        break;

      case 17:
      case 18:
        this.changeTextButton("Ввод", "<-", "Отмена");
        break;

      case 19:
        this.changeTextButton("Пред.", "Итог", "След.");
        break;

      case 20:
        this.changeTextButton("Пред.", "Итог", "");
        break;
    }
  },

  startTime() {
    menuRadiostation.statusTime = true;
    menuRadiostation.startTimeVal = new Date();
    menuRadiostation.divTime.textContent = getTime(new Date(0));

    this.timeInterval = setInterval(() => {
      menuRadiostation.divTime.textContent = getTime(new Date().valueOf() - menuRadiostation.startTimeVal.valueOf());
    }, 1000);
  },

  stopTime() {
    clearInterval(this.timeInterval);
    menuRadiostation.statusTime = false;
  },

  closeCurrentMenu() {
    menuRadiostation.listOfMenu[menuRadiostation.currentMenu].className =
      "not_active";
  },

  turnOnDisplay() {
    menuRadiostation.listOfMenuElements.forEach((e) => {
      e.className = "active";
    });
  },

  shutDown() {
    menuRadiostation.lightKeyboardOff();
    menuRadiostation.listOfMenuElements.forEach((e) => {
      e.className = "not_active";
    });
  },

  shutDownDisplay() {
    menuRadiostation.listOfMenuElements.forEach((e) => {
      e.className = "not_active";
    });
  },

  changeTextButton(left, center, right) {
    document.getElementById("left_bottom_button").textContent = left;
    document.getElementById("center_bottom_button").textContent = center;
    document.getElementById("right_bottom_button").textContent = right;
  },
};
