let speakVolumeLevel = menuRadiostation.speakVolume;
let autoBlocking = null;
let flagAutoBlock = false;
let flagLightKeyboard = false;

function rmeoveAllId(divCollection, pos) {
  for (let i = pos; i < divCollection.length; i++)
    if (divCollection[i].id !== "block") divCollection[i].id = "";
}

function changeVolume(graph, digit, volume) {
  divCollection = document.getElementById(graph);
  divCollection.textContent = "[ ";
  for (i = 0; i < 8; i++) {
    if (i <= volume / 3) divCollection.textContent += "| ";
    else divCollection.textContent += "  ";
  }
  divCollection.textContent += "]";
  divCollection = document.getElementById(digit);
  divCollection.textContent = volume;
}

function autoBlock() {
  return setInterval(() => {
    menuRadiostation.block();
  }, 7000);
}

function menu(currentMenu, position, keyCode) {
  if (autoBlocking) {
    clearInterval(autoBlocking);
    autoBlocking = autoBlock();
  }

  let pos = position;
  let divCollection = null;
  switch (currentMenu) {
    case 0:
      switch (keyCode) {
        case "KeyM":
          divCollection = document.getElementById("main_menu").children;
          rmeoveAllId(divCollection, 1);
          if (menuRadiostation.blocking) {
            divCollection[2].id = "current_position";
          } else {
            divCollection[1].id = "current_position";
          }

          return {
            currentMenu: 1,
            position: 0,
          };
      }
      break;

    case 1:
      divCollection = document.getElementById("main_menu").children;
      switch (keyCode) {
        case "Escape":
          divCollection[0].id = "";
          rmeoveAllId(divCollection, 1);
          if (menuRadiostation.blocking) {
            divCollection[2].id = "current_position";
          } else {
            divCollection[1].id = "current_position";
          }
          return {
            currentMenu: 0,
            position,
          };

        case "Enter":
          divCollection[0].id = "";
          rmeoveAllId(divCollection, 1);
          if (menuRadiostation.blocking) {
            divCollection[2].id = "current_position";
          } else {
            divCollection[1].id = "current_position";
          }
          switch (position) {
            case 0:
              return {
                currentMenu: 2,
                position,
              };
            case 1:
              return {
                currentMenu: 3,
                position,
              };
            case 2:
              return {
                currentMenu: 4,
                position,
              };
            case 3:
              return {
                currentMenu: 5,
                position,
              };
            case 4:
              return {
                currentMenu: 6,
                position,
              };
          }

        case "Digit2":
          if (position - 1 >= 0)
            if (menuRadiostation.blocking)
              if (position - 1 > 0) pos = position - 1;
              else pos = position;
            else pos = position - 1;
          else if (menuRadiostation.blocking && position === 0) pos = 1;
          else pos = position;

          if (pos < 2) divCollection[0].id = "";
          rmeoveAllId(divCollection, 1);
          divCollection[pos + 1].id = "current_position";
          return {
            currentMenu,
            position: pos,
          };

        case "Digit8":
          if (position === 0 && menuRadiostation.blocking) pos = 2;
          else pos = position + 1 < 5 ? position + 1 : position;

          if (pos === 4) divCollection[0].id = "scroll_main_menu";
          rmeoveAllId(divCollection, 1);
          divCollection[pos + 1].id = "current_position";
          return {
            currentMenu,
            position: pos,
          };
      }
      break;

    case 2:
      return null;

    case 3:
      divCollection = document.getElementById("parameters_menu").children;
      switch (keyCode) {
        case "Escape":
          divCollection[0].id = "";
          rmeoveAllId(divCollection, 1);
          divCollection[1].id = "current_position";
          return {
            currentMenu: 1,
            position,
          };

        case "Enter":
          divCollection[0].id = "";
          rmeoveAllId(divCollection, 1);
          divCollection[1].id = "current_position";
          switch (position) {
            case 0:
              speakVolumeLevel = menuRadiostation.speakVolume;
              return {
                currentMenu: 9,
                position,
              };
            case 1:
              divCollection = document.getElementById("text_blocking");
              if (flagAutoBlock) divCollection.textContent = "Вкл";
              else divCollection.textContent = "Выкл";
              return {
                currentMenu: 10,
                position,
              };
            case 2:
              divCollection = document.getElementById("text_light_keyboard");
              if (flagLightKeyboard) divCollection.textContent = "Вкл";
              else divCollection.textContent = "Выкл";
              return {
                currentMenu: 11,
                position,
              };
            case 3:
              return {
                currentMenu: 12,
                position,
              };
          }

        case "Digit2":
          pos = position - 1 >= 0 ? position - 1 : position;
          rmeoveAllId(divCollection, 1);
          divCollection[pos + 1].id = "current_position";
          return {
            currentMenu,
            position: pos,
          };

        case "Digit8":
          pos = position + 1 < 4 ? position + 1 : position;
          rmeoveAllId(divCollection, 1);
          divCollection[pos + 1].id = "current_position";
          return {
            currentMenu,
            position: pos,
          };
      }
      break;

    case 4:
      divCollection = document.getElementById("info_menu").children;
      switch (keyCode) {
        case "Escape":
          divCollection[0].id = "";
          rmeoveAllId(divCollection, 1);
          divCollection[1].id = "current_position";
          return {
            currentMenu: 1,
            position,
          };

        case "Enter":
          divCollection[0].id = "";
          rmeoveAllId(divCollection, 1);
          divCollection[1].id = "current_position";
          switch (position) {
            case 0:
              return {
                currentMenu: 7, // Temperature
                position,
              };
            case 1:
              return {
                currentMenu: 8, // Version
                position,
              };
          }

        case "Digit2":
          pos = position - 1 >= 0 ? position - 1 : position;
          rmeoveAllId(divCollection, 1);
          divCollection[pos + 1].id = "current_position";
          return {
            currentMenu,
            position: pos,
          };

        case "Digit8":
          pos = position + 1 < 2 ? position + 1 : position;
          rmeoveAllId(divCollection, 1);
          divCollection[pos + 1].id = "current_position";
          return {
            currentMenu,
            position: pos,
          };
      }
      break;

    case 5:
      divCollection = document.getElementById("access_menu").children;
      switch (keyCode) {
        case "Escape":
          divCollection[0].id = "";
          rmeoveAllId(divCollection, 1);
          divCollection[1].id = "current_position";
          return {
            currentMenu: 1,
            position,
          };

        case "Enter":
          divCollection[0].id = "";
          rmeoveAllId(divCollection, 1);
          divCollection[1].id = "current_position";
          switch (position) {
            case 0:
              return {
                currentMenu: 7,
                position,
              };
            case 1:
              return {
                currentMenu: 8,
                position,
              };
          }

        case "Digit2":
          pos = position - 1 >= 0 ? position - 1 : position;
          rmeoveAllId(divCollection, 1);
          divCollection[pos + 1].id = "current_position";
          return {
            currentMenu,
            position: pos,
          };

        case "Digit8":
          pos = position + 1 < 4 ? position + 1 : position;
          rmeoveAllId(divCollection, 1);
          divCollection[pos + 1].id = "current_position";
          return {
            currentMenu,
            position: pos,
          };
      }
      break;

    case 6:
      return null;

    case 7:
    case 8:
      if (keyCode === "Escape")
        return {
          currentMenu: 4,
          position,
        };
      break;

    case 9:
      switch (keyCode) {
        case "Escape":
          speakVolumeLevel = menuRadiostation.speakVolume;
          changeVolume(
            "graph_speak_volume",
            "digit_speak_volume",
            speakVolumeLevel
          );
          return {
            currentMenu: 3,
            position,
          };

        case "Enter":
          menuRadiostation.speakVolume = speakVolumeLevel;
          return {
            currentMenu: 3,
            position,
          };

        case "Digit2":
          if (speakVolumeLevel < 24) speakVolumeLevel++;
          changeVolume(
            "graph_speak_volume",
            "digit_speak_volume",
            speakVolumeLevel
          );
          return {
            currentMenu: 9,
            position,
          };

        case "Digit8":
          if (speakVolumeLevel > 1) speakVolumeLevel--;
          changeVolume(
            "graph_speak_volume",
            "digit_speak_volume",
            speakVolumeLevel
          );
          return {
            currentMenu: 9,
            position,
          };
      }
      break;

    case 10:
      divCollection = document.getElementById("text_blocking");
      switch (keyCode) {
        case "Escape":
          if (autoBlocking) flagAutoBlock = true;
          else flagAutoBlock = false;
          return {
            currentMenu: 3,
            position,
          };

        case "Enter":
          if (flagAutoBlock) autoBlocking = autoBlock();
          else if (autoBlocking) clearInterval(autoBlocking);
          return {
            currentMenu: 3,
            position,
          };

        case "Digit2":
          flagAutoBlock = !flagAutoBlock;
          if (flagAutoBlock) divCollection.textContent = "Вкл";
          else divCollection.textContent = "Выкл";
          return {
            currentMenu: 10,
            position,
          };

        case "Digit8":
          flagAutoBlock = !flagAutoBlock;
          if (flagAutoBlock) divCollection.textContent = "Вкл";
          else divCollection.textContent = "Выкл";
          return {
            currentMenu: 10,
            position,
          };
      }
      break;

    case 11:
      divCollection = document.getElementById("text_light_keyboard");
      switch (keyCode) {
        case "Escape":
          if (menuRadiostation.lightKeyboard) flagLightKeyboard = true;
          else flagLightKeyboard = false;
          return {
            currentMenu: 3,
            position,
          };

        case "Enter":
          if (flagLightKeyboard) menuRadiostation.lightKeyboardOn();
          else menuRadiostation.lightKeyboardOff();
          return {
            currentMenu: 3,
            position,
          };

        case "Digit2":
          flagLightKeyboard = !flagLightKeyboard;
          if (flagLightKeyboard) divCollection.textContent = "Вкл";
          else divCollection.textContent = "Выкл";
          return {
            currentMenu: 11,
            position,
          };

        case "Digit8":
          flagLightKeyboard = !flagLightKeyboard;
          if (flagLightKeyboard) divCollection.textContent = "Вкл";
          else divCollection.textContent = "Выкл";
          return {
            currentMenu: 11,
            position,
          };
      }
      break;

    case 12:
      divCollection = document.getElementById("timer_display");
      switch (keyCode) {
        case "Escape":
          if (menuRadiostation.lightKeyboard) flagLightKeyboard = true;
          else flagLightKeyboard = false;
          return {
            currentMenu: 3,
            position,
          };

        case "Enter":
          if (flagLightKeyboard) menuRadiostation.lightKeyboardOn();
          else menuRadiostation.lightKeyboardOff();
          return {
            currentMenu: 3,
            position,
          };

        case "Digit2":
          flagLightKeyboard = !flagLightKeyboard;
          if (flagLightKeyboard) divCollection.textContent = "Вкл";
          else divCollection.textContent = "Выкл";
          return {
            currentMenu: 11,
            position,
          };

        case "Digit8":
          flagLightKeyboard = !flagLightKeyboard;
          if (flagLightKeyboard) divCollection.textContent = "Вкл";
          else divCollection.textContent = "Выкл";
          return {
            currentMenu: 11,
            position,
          };
      }
      break;
  }
  return null;
}
