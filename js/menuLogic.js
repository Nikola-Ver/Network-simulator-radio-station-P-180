let speakVolumeLevel = menuRadiostation.speakVolume;
let autoBlocking = null;
let timerDisplay = 0;
let flagAutoBlock = false;
let flagLightKeyboard = false;
let timerDisplayID = null;
let password = "";
let currentChannel = 0;

function getTextFrequency(frequency) {
  let frequencyNum = ((frequency + 2400) / 80) * 1000;
  let numAfterPoint = String((frequencyNum * 10) % 10);
  if (numAfterPoint !== "0") numAfterPoint = "";
  else numAfterPoint = "." + numAfterPoint;
  let textFrequency = "";
  textFrequency += String(frequencyNum) + numAfterPoint;
  return textFrequency;
}

function rmeoveAllId(divCollection, pos) {
  for (let i = pos; i < divCollection.length; i++)
    if (divCollection[i].id !== "block") divCollection[i].id = "";
}

function changeVolume(graph, digit, volume) {
  let divCollection = document.getElementById(graph);
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

  if (timerDisplayID) {
    timerDisplayID = menuRadiostation.clearTimerDisplay(timerDisplayID);
    timerDisplayID = menuRadiostation.setTimerDisplay(timerDisplay);
    menuImplementation.turnOnDisplay();
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
              divCollection = document.getElementById("test_menu_text");
              if (menuRadiostation.blocking)
                divCollection.textContent = "Радиостанция заблокирована";
              else
                divCollection.textContent =
                  "Радиостанция готова к использованию";
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
      divCollection = document.getElementById("settings_channel").children;
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
          divCollection[position + 1].id = "current_position";
          switch (position) {
            case 0:
              currentChannel = channel;
              divCollection = document.getElementById("analogue_modulation");
              divCollection.textContent =
                userModulation[currentChannel] === 0 ? "АМ" : "ЧМ";
              return {
                currentMenu: 16,
                position,
              };
            case 1:
              return {
                currentMenu: 2,
                position,
              };
            case 2:
              return {
                currentMenu: 2,
                position,
              };
            case 3:
              return {
                currentMenu: 2,
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
              divCollection = document.getElementById("text_timer");
              divCollection.textContent = timerDisplay;
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
              menuRadiostation.block();
              return {
                currentMenu: 5,
                position,
              };

            case 1:
              return {
                currentMenu: 13,
                position,
              };

            case 2:
              return {
                currentMenu: 14,
                position,
              };

            case 3:
              return {
                currentMenu: 15,
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
          if (menuRadiostation.blocking)
            pos = position + 1 < 3 ? position + 1 : position;
          else pos = position + 1 < 4 ? position + 1 : position;

          rmeoveAllId(divCollection, 1);
          divCollection[pos + 1].id = "current_position";
          return {
            currentMenu,
            position: pos,
          };
      }
      break;

    case 6:
      if (keyCode === "Escape")
        return {
          currentMenu: 1,
          position,
        };

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

        case "NumpadMultiply":
          flagAutoBlock = true;
          divCollection.textContent = "Вкл";
          return {
            currentMenu: 10,
            position,
          };

        case "NumpadDivide":
          flagAutoBlock = false;
          divCollection.textContent = "Выкл";
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

        case "NumpadMultiply":
          flagLightKeyboard = true;
          divCollection.textContent = "Вкл";
          return {
            currentMenu: 11,
            position,
          };

        case "NumpadDivide":
          flagLightKeyboard = false;
          divCollection.textContent = "Выкл";
          return {
            currentMenu: 11,
            position,
          };
      }
      break;

    case 12:
      divCollection = document.getElementById("text_timer");
      switch (keyCode) {
        case "Escape":
          return {
            currentMenu: 3,
            position,
          };

        case "Enter":
          if (timerDisplay === 0) {
            if (timerDisplayID)
              timerDisplayID = menuRadiostation.clearTimerDisplay(
                timerDisplayID
              );
          } else {
            timerDisplayID = menuRadiostation.setTimerDisplay(timerDisplay);
          }
          return {
            currentMenu: 3,
            position,
          };

        case "Digit2":
          if (timerDisplay < 60) timerDisplay++;
          divCollection.textContent = timerDisplay;
          return {
            currentMenu: 12,
            position,
          };

        case "Digit8":
          if (timerDisplay > 0) timerDisplay--;
          divCollection.textContent = timerDisplay;
          return {
            currentMenu: 12,
            position,
          };
      }
      break;

    case 13:
      divCollection = document.getElementById("password_view");
      if (keyCode.search(/Digit/gi) !== -1 && password.length < 4) {
        const digit = keyCode.replace("Digit", "");
        password += digit;
        divCollection.textContent += "#";
      } else {
        switch (keyCode) {
          case "Escape":
            divCollection.textContent = "";
            password = "";
            return {
              currentMenu: 5,
              position,
            };

          case "Enter":
            if (password === menuRadiostation.passwordSetting)
              menuRadiostation.block();

            divCollection.textContent = "";
            password = "";
            return {
              currentMenu: 5,
              position,
            };
        }
      }
      break;

    case 14:
      divCollection = document.getElementById("password_setting");
      if (keyCode.search(/Digit/gi) !== -1 && password.length < 4) {
        const digit = keyCode.replace("Digit", "");
        password += digit;
        divCollection.textContent += "#";
      } else {
        switch (keyCode) {
          case "Escape":
            menuRadiostation.block();
            divCollection.textContent = "";
            password = "";
            return {
              currentMenu: 5,
              position,
            };

          case "Enter":
            if (password === menuRadiostation.passwordSetting)
              menuRadiostation.unblock();
            else menuRadiostation.block();

            divCollection.textContent = "";
            password = "";
            return {
              currentMenu: 5,
              position,
            };
        }
      }
      break;

    case 15:
      divCollection = document.getElementById("password_change");
      if (keyCode.search(/Digit/gi) !== -1 && password.length < 4) {
        const digit = keyCode.replace("Digit", "");
        password += digit;
        divCollection.textContent += "#";
      } else {
        switch (keyCode) {
          case "Escape":
            divCollection.textContent = "";
            password = "";
            return {
              currentMenu: 5,
              position,
            };

          case "Enter":
            menuRadiostation.passwordSetting = password;
            divCollection.textContent = "";
            password = "";
            return {
              currentMenu: 5,
              position,
            };
        }
      }
      break;

    case 16:
      divCollection = document.getElementById("text_timer");
      switch (keyCode) {
        case "Escape":
          divCollection = document.getElementById(
            "old_input_in_frequency_analogue"
          );
          divCollection.textContent = getTextFrequency(
            userFrequencysIn[currentChannel]
          );
          return {
            currentMenu: 17,
            position,
          };

        case "NumpadMultiply":
          if (userModulation[currentChannel] > 0)
            userModulation[currentChannel]--;
          divCollection = document.getElementById("analogue_modulation");
          divCollection.textContent =
            userModulation[currentChannel] === 0 ? "АМ" : "ЧМ";
          return {
            currentMenu: 16,
            position,
          };

        case "NumpadDivide":
          if (userModulation[currentChannel] < 1)
            userModulation[currentChannel]++;
          divCollection = document.getElementById("analogue_modulation");
          divCollection.textContent =
            userModulation[currentChannel] === 0 ? "АМ" : "ЧМ";
          return {
            currentMenu: 16,
            position,
          };
      }
      break;

    case 17:
      break;

    case 18:
      break;

    case 19:
      break;

    case 20:
      break;
  }
  return null;
}
