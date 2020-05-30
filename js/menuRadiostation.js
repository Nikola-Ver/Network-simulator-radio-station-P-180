const menuRadiostation = {
  statusWorking: false,
  statusHeadset: false,
  statusAntenna: false,
  statusBattarey: false,
  statusBroadcating: false,
  statusBeep: false,
  statusTime: false,

  startWorking() {
    menu.mainMenu();
    this.startTime();
    this.statusWorking = true;
  },
  stopWorking() {
    this.stopTime();
    this.statusWorking = false;
  },

  headsetOn() {
    this.statusHeadset = true;
  },
  headsetOff() {
    this.statusHeadset = false;
  },

  antennaOn() {
    this.statusAntenna = true;
  },
  antennaOff() {
    this.statusAntenna = false;
  },

  battareyOn() {
    this.statusBattarey = true;
  },
  battareyOff() {
    menu.shutDown();
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

  startTime() {
    statusTime = true;
  },
  stopTime() {
    statusTime = false;
  },
};

const menu = {
  mainMenu() {},

  shutDown() {},
};
