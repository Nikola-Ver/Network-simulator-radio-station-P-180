const [rightButtonChannel] = document.getElementsByClassName("arrow_right");
const [leftButtonChannel] = document.getElementsByClassName("arrow_left");

rightButtonChannel.addEventListener("click", () => {
  if (channel > 0) channel--;
  if (channel < 9)
    menuRadiostation.divChannel.textContent = "0" + String(channel + 1);
  else menuRadiostation.divChannel.textContent = channel + 1;
});

leftButtonChannel.addEventListener("click", () => {
  if (channel < 15) channel++;
  if (channel < 9)
    menuRadiostation.divChannel.textContent = "0" + String(channel + 1);
  else menuRadiostation.divChannel.textContent = channel + 1;
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
        menuRadiostation.position = 0;
      }
    }
  }
}

const menuRadiostation = {
  blocking: true,
  statusWorking: false,
  statusHeadset: false,
  statusAntenna: false,
  statusBattarey: false,
  statusBroadcating: false,
  statusBeep: false,
  statusTime: false,
  position: 0,
  speakVolume: 24,
  volume: 24,
  channel: 0,
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
    this.statusWorking = false;
  },

  block() {},

  unblock() {},

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
        this.changeTextButton("Выбор", "", "Выход");
        break;

      case 7:
      case 8:
        this.changeTextButton("", "", "Выход");
        break;
    }
  },

  async startTime() {
    menuRadiostation.statusTime = true;
    menuRadiostation.divTime.textContent = getTime(new Date());

    this.timeInterval = setInterval(async () => {
      menuRadiostation.divTime.textContent = getTime(new Date());
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

  shutDown() {
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
