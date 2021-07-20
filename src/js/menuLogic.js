var speakVolumeLevel = menuRadiostation.speakVolume;
var volumeLevel = menuRadiostation.volume;
var autoBlocking = null;
var timerDisplay = 0;
var flagAutoBlock = false;
var flagLightKeyboard = false;
var timerDisplayID = null;
var password = '';
var currentChannel = 0;
var textFrequencyTemp = '';
var digit = '';

function createFrequencyText(frequency) {
  let result = '';
  if (frequency[frequency.length - 1] === '5') {
    for (let i = 0; i < 7 - frequency.length; i++) result += '0';
    result += frequency.slice(0, -1) + '.' + frequency[frequency.length - 1];
  } else {
    if (frequency.length > 6) frequency = frequency.slice(0, -1);
    for (let i = 0; i < 6 - frequency.length; i++) result += '0';
    result += frequency + '.0';
  }
  return result;
}

function getNumFrequency(frequency) {
  let frequencyNum = (Number(frequency) * 2) / 25 - 2400;
  return frequencyNum;
}

function getTextFrequency(frequency) {
  let frequencyNum = ((frequency + 2400) / 2) * 25;
  let numAfterPoint = String((frequencyNum * 10) % 10);
  if (numAfterPoint !== '0') numAfterPoint = '';
  else numAfterPoint = '.' + numAfterPoint;
  let textFrequency = '';
  textFrequency += String(frequencyNum) + numAfterPoint;
  return textFrequency;
}

function removeAllID(divCollection, pos) {
  for (let i = pos; i < divCollection.length; i++)
    if (divCollection[i].id !== 'block') divCollection[i].id = '';
}

function changeVolume(graph, localDigit, volume) {
  let divCollection = document.getElementById(graph);
  divCollection.textContent = '[ ';
  for (i = 0; i < 8; i++) {
    if (i < volume / 3) divCollection.textContent += '| ';
    else divCollection.textContent += '  ';
  }
  divCollection.textContent += ']';
  divCollection = document.getElementById(localDigit);
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
        case 'KeyM':
          divCollection = document.getElementById('main_menu').children;
          removeAllID(divCollection, 1);
          if (menuRadiostation.blocking) {
            divCollection[2].id = 'current_position';
          } else {
            divCollection[1].id = 'current_position';
          }

          return {
            currentMenu: 1,
            position: 0,
          };

        case 'Digit1':
          return {
            currentMenu: 21,
            position: 0,
          };

        case 'Digit2':
          menuRadiostation.frequencyCallFlag =
            !menuRadiostation.frequencyCallFlag;
          menuRadiostation.setFrequency();
          divCollection = document.getElementById('common_top_text_channel');
          if (menuRadiostation.frequencyCallFlag) {
            divCollection.textContent = 'Адрес вызова (А)';
          } else {
            divCollection.textContent = 'Адрес приема (А)';
          }
          return {
            currentMenu: 0,
            position: 0,
          };

        case 'Digit7':
          menuRadiostation.setPower(3);
          return {
            currentMenu: 0,
            position: 0,
          };

        case 'Digit0':
          divCollection = document.getElementById('_test_menu_text');
          if (menuRadiostation.blocking)
            divCollection.textContent = 'Радиостанция заблокирована';
          else
            divCollection.textContent = 'Радиостанция готова к использованию';
          return {
            currentMenu: 22,
            position: 0,
          };
      }
      break;

    case 1:
      divCollection = document.getElementById('main_menu').children;
      switch (keyCode) {
        case 'Escape':
          divCollection[0].id = '';
          removeAllID(divCollection, 1);
          if (menuRadiostation.blocking) {
            divCollection[2].id = 'current_position';
          } else {
            divCollection[1].id = 'current_position';
          }
          return {
            currentMenu: 0,
            position,
          };

        case 'Enter':
          divCollection[0].id = '';
          removeAllID(divCollection, 1);
          if (menuRadiostation.blocking) {
            divCollection[2].id = 'current_position';
          } else {
            divCollection[1].id = 'current_position';
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
              divCollection = document.getElementById('test_menu_text');
              if (menuRadiostation.blocking)
                divCollection.textContent = 'Радиостанция заблокирована';
              else
                divCollection.textContent =
                  'Радиостанция готова к использованию';
              return {
                currentMenu: 6,
                position,
              };
          }

        case 'Digit2':
          if (position - 1 >= 0)
            if (menuRadiostation.blocking)
              if (position - 1 > 0) pos = position - 1;
              else pos = position;
            else pos = position - 1;
          else if (menuRadiostation.blocking && position === 0) pos = 1;
          else pos = position;

          if (pos < 2) divCollection[0].id = '';
          removeAllID(divCollection, 1);
          divCollection[pos + 1].id = 'current_position';
          return {
            currentMenu,
            position: pos,
          };

        case 'Digit8':
          if (position === 0 && menuRadiostation.blocking) pos = 2;
          else pos = position + 1 < 5 ? position + 1 : position;

          if (pos === 4) divCollection[0].id = 'scroll_main_menu';
          removeAllID(divCollection, 1);
          divCollection[pos + 1].id = 'current_position';
          return {
            currentMenu,
            position: pos,
          };
      }
      break;

    case 2:
      divCollection = document.getElementById('settings_channel').children;
      switch (keyCode) {
        case 'Escape':
          divCollection[0].id = '';
          removeAllID(divCollection, 1);
          divCollection[1].id = 'current_position';
          return {
            currentMenu: 1,
            position,
          };

        case 'Enter':
          divCollection[0].id = '';
          removeAllID(divCollection, 1);
          divCollection[1].id = 'current_position';
          switch (position) {
            case 0:
              document.getElementById('digit_frch').style.opacity = '0';
              currentChannel = channel;
              divCollection = document.getElementById('analogue_modulation');
              divCollection.textContent =
                userModulation[currentChannel] === 0 ? 'АМ' : 'ЧМ';
              [divCollection] =
                document.getElementsByClassName('operating_mode');
              divCollection.textContent = 'АФ';
              return {
                currentMenu: 16,
                position,
              };
            case 1:
              document.getElementById('digit_frch').style.opacity = '0';
              [divCollection] =
                document.getElementsByClassName('operating_mode');
              divCollection.textContent = 'АСФ';
              return {
                currentMenu: 23,
                position,
              };
            case 2:
              document.getElementById('digit_frch').style.opacity = '0';
              [divCollection] =
                document.getElementsByClassName('operating_mode');
              divCollection.textContent = 'ЦФ';
              userModulation[currentChannel] = 2;
              return {
                currentMenu: 28,
                position,
              };
            case 3:
              [divCollection] =
                document.getElementsByClassName('operating_mode');
              divCollection.textContent = 'ЦФ';
              document.getElementById('digit_frch').style.opacity = '';
              userModulation[currentChannel] = 3;
              return {
                currentMenu: 2,
                position,
              };
          }

        case 'Digit2':
          pos = position - 1 >= 0 ? position - 1 : position;
          removeAllID(divCollection, 1);
          divCollection[pos + 1].id = 'current_position';
          return {
            currentMenu,
            position: pos,
          };

        case 'Digit8':
          pos = position + 1 < 4 ? position + 1 : position;
          removeAllID(divCollection, 1);
          divCollection[pos + 1].id = 'current_position';
          return {
            currentMenu,
            position: pos,
          };
      }
      break;

    case 3:
      divCollection = document.getElementById('parameters_menu').children;
      switch (keyCode) {
        case 'Escape':
          divCollection[0].id = '';
          removeAllID(divCollection, 1);
          divCollection[1].id = 'current_position';
          return {
            currentMenu: 1,
            position,
          };

        case 'Enter':
          divCollection[0].id = '';
          removeAllID(divCollection, 1);
          divCollection[1].id = 'current_position';
          switch (position) {
            case 0:
              speakVolumeLevel = menuRadiostation.speakVolume;
              return {
                currentMenu: 9,
                position,
              };
            case 1:
              divCollection = document.getElementById('text_blocking');
              if (flagAutoBlock) divCollection.textContent = 'Вкл';
              else divCollection.textContent = 'Выкл';
              return {
                currentMenu: 10,
                position,
              };
            case 2:
              divCollection = document.getElementById('text_light_keyboard');
              if (flagLightKeyboard) divCollection.textContent = 'Вкл';
              else divCollection.textContent = 'Выкл';
              return {
                currentMenu: 11,
                position,
              };
            case 3:
              divCollection = document.getElementById('text_timer');
              divCollection.textContent = timerDisplay;
              return {
                currentMenu: 12,
                position,
              };
          }

        case 'Digit2':
          pos = position - 1 >= 0 ? position - 1 : position;
          removeAllID(divCollection, 1);
          divCollection[pos + 1].id = 'current_position';
          return {
            currentMenu,
            position: pos,
          };

        case 'Digit8':
          pos = position + 1 < 4 ? position + 1 : position;
          removeAllID(divCollection, 1);
          divCollection[pos + 1].id = 'current_position';
          return {
            currentMenu,
            position: pos,
          };
      }
      break;

    case 4:
      divCollection = document.getElementById('info_menu').children;
      switch (keyCode) {
        case 'Escape':
          divCollection[0].id = '';
          removeAllID(divCollection, 1);
          divCollection[1].id = 'current_position';
          return {
            currentMenu: 1,
            position,
          };

        case 'Enter':
          divCollection[0].id = '';
          removeAllID(divCollection, 1);
          divCollection[1].id = 'current_position';
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

        case 'Digit2':
          pos = position - 1 >= 0 ? position - 1 : position;
          removeAllID(divCollection, 1);
          divCollection[pos + 1].id = 'current_position';
          return {
            currentMenu,
            position: pos,
          };

        case 'Digit8':
          pos = position + 1 < 2 ? position + 1 : position;
          removeAllID(divCollection, 1);
          divCollection[pos + 1].id = 'current_position';
          return {
            currentMenu,
            position: pos,
          };
      }
      break;

    case 5:
      divCollection = document.getElementById('access_menu').children;
      switch (keyCode) {
        case 'Escape':
          divCollection[0].id = '';
          removeAllID(divCollection, 1);
          divCollection[1].id = 'current_position';
          return {
            currentMenu: 1,
            position,
          };

        case 'Enter':
          divCollection[0].id = '';
          removeAllID(divCollection, 1);
          divCollection[1].id = 'current_position';
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

        case 'Digit2':
          pos = position - 1 >= 0 ? position - 1 : position;
          removeAllID(divCollection, 1);
          divCollection[pos + 1].id = 'current_position';
          return {
            currentMenu,
            position: pos,
          };

        case 'Digit8':
          if (menuRadiostation.blocking)
            pos = position + 1 < 3 ? position + 1 : position;
          else pos = position + 1 < 4 ? position + 1 : position;

          removeAllID(divCollection, 1);
          divCollection[pos + 1].id = 'current_position';
          return {
            currentMenu,
            position: pos,
          };
      }
      break;

    case 6:
      if (keyCode === 'Escape')
        return {
          currentMenu: 1,
          position,
        };
      break;

    case 7:
    case 8:
      if (keyCode === 'Escape')
        return {
          currentMenu: 4,
          position,
        };
      break;

    case 9:
      switch (keyCode) {
        case 'Escape':
          speakVolumeLevel = menuRadiostation.speakVolume;
          changeVolume(
            'graph_speak_volume',
            'digit_speak_volume',
            speakVolumeLevel
          );
          return {
            currentMenu: 3,
            position,
          };

        case 'Enter':
          menuRadiostation.speakVolume = speakVolumeLevel;
          return {
            currentMenu: 3,
            position,
          };

        case 'Digit2':
          if (speakVolumeLevel < 24) speakVolumeLevel++;
          changeVolume(
            'graph_speak_volume',
            'digit_speak_volume',
            speakVolumeLevel
          );
          return {
            currentMenu: 9,
            position,
          };

        case 'Digit8':
          if (speakVolumeLevel > 1) speakVolumeLevel--;
          changeVolume(
            'graph_speak_volume',
            'digit_speak_volume',
            speakVolumeLevel
          );
          return {
            currentMenu: 9,
            position,
          };
      }
      break;

    case 10:
      divCollection = document.getElementById('text_blocking');
      switch (keyCode) {
        case 'Escape':
          if (autoBlocking) flagAutoBlock = true;
          else flagAutoBlock = false;
          return {
            currentMenu: 3,
            position,
          };

        case 'Enter':
          if (flagAutoBlock) autoBlocking = autoBlock();
          else if (autoBlocking) clearInterval(autoBlocking);
          return {
            currentMenu: 3,
            position,
          };

        case 'NumpadMultiply':
          flagAutoBlock = true;
          divCollection.textContent = 'Вкл';
          return {
            currentMenu: 10,
            position,
          };

        case 'NumpadDivide':
          flagAutoBlock = false;
          divCollection.textContent = 'Выкл';
          return {
            currentMenu: 10,
            position,
          };
      }
      break;

    case 11:
      divCollection = document.getElementById('text_light_keyboard');
      switch (keyCode) {
        case 'Escape':
          if (menuRadiostation.lightKeyboard) flagLightKeyboard = true;
          else flagLightKeyboard = false;
          return {
            currentMenu: 3,
            position,
          };

        case 'Enter':
          if (flagLightKeyboard) menuRadiostation.lightKeyboardOn();
          else menuRadiostation.lightKeyboardOff();
          return {
            currentMenu: 3,
            position,
          };

        case 'NumpadMultiply':
          flagLightKeyboard = true;
          divCollection.textContent = 'Вкл';
          return {
            currentMenu: 11,
            position,
          };

        case 'NumpadDivide':
          flagLightKeyboard = false;
          divCollection.textContent = 'Выкл';
          return {
            currentMenu: 11,
            position,
          };
      }
      break;

    case 12:
      divCollection = document.getElementById('text_timer');
      switch (keyCode) {
        case 'Escape':
          return {
            currentMenu: 3,
            position,
          };

        case 'Enter':
          if (timerDisplay === 0) {
            if (timerDisplayID)
              timerDisplayID =
                menuRadiostation.clearTimerDisplay(timerDisplayID);
          } else {
            timerDisplayID = menuRadiostation.setTimerDisplay(timerDisplay);
          }
          return {
            currentMenu: 3,
            position,
          };

        case 'Digit2':
          if (timerDisplay < 60) timerDisplay++;
          divCollection.textContent = timerDisplay;
          return {
            currentMenu: 12,
            position,
          };

        case 'Digit8':
          if (timerDisplay > 0) timerDisplay--;
          divCollection.textContent = timerDisplay;
          return {
            currentMenu: 12,
            position,
          };
      }
      break;

    case 13:
      divCollection = document.getElementById('password_view');
      if (keyCode.search(/Digit/gi) !== -1 && password.length < 4) {
        digit = keyCode.replace('Digit', '');
        password += digit;
        divCollection.textContent += '#';
      } else {
        switch (keyCode) {
          case 'Escape':
            divCollection.textContent = '';
            password = '';
            return {
              currentMenu: 5,
              position,
            };

          case 'Enter':
            if (
              password === menuRadiostation.passwordSetting &&
              password.length === 4
            )
              menuRadiostation.block();

            divCollection.textContent = '';
            password = '';
            return {
              currentMenu: 5,
              position,
            };
        }
      }
      break;

    case 14:
      divCollection = document.getElementById('password_setting');
      if (keyCode.search(/Digit/gi) !== -1 && password.length < 4) {
        digit = keyCode.replace('Digit', '');
        password += digit;
        divCollection.textContent += '#';
      } else {
        switch (keyCode) {
          case 'Escape':
            menuRadiostation.block();
            divCollection.textContent = '';
            password = '';
            return {
              currentMenu: 5,
              position,
            };

          case 'Enter':
            if (
              password === menuRadiostation.passwordSetting &&
              password.length === 4
            )
              menuRadiostation.unblock();
            else menuRadiostation.block();

            divCollection.textContent = '';
            password = '';
            return {
              currentMenu: 5,
              position,
            };
        }
      }
      break;

    case 15:
      divCollection = document.getElementById('password_change');
      if (keyCode.search(/Digit/gi) !== -1 && password.length < 4) {
        digit = keyCode.replace('Digit', '');
        password += digit;
        divCollection.textContent += '#';
      } else {
        switch (keyCode) {
          case 'Escape':
            divCollection.textContent = '';
            password = '';
            return {
              currentMenu: 5,
              position,
            };

          case 'Enter':
            if (password.length === 4) {
              menuRadiostation.passwordSetting = password;
              divCollection.textContent = '';
              password = '';
              return {
                currentMenu: 5,
                position,
              };
            }
        }
      }
      break;

    case 16:
      switch (keyCode) {
        case 'Escape':
          divCollection = document.getElementById(
            'old_input_in_frequency_analogue'
          );
          divCollection.textContent = getTextFrequency(
            userFrequencysIn[currentChannel]
          );
          return {
            currentMenu: 17,
            position,
          };

        case 'KeyM':
          menuRadiostation.setFrequency();
          return {
            currentMenu: 2,
            position,
          };

        case 'NumpadMultiply':
          if (userModulation[currentChannel] > 0)
            userModulation[currentChannel] = 0;
          divCollection = document.getElementById('analogue_modulation');
          divCollection.textContent =
            userModulation[currentChannel] === 0 ? 'АМ' : 'ЧМ';
          return {
            currentMenu: 16,
            position,
          };

        case 'NumpadDivide':
          if (userModulation[currentChannel] < 1)
            userModulation[currentChannel] = 1;
          divCollection = document.getElementById('analogue_modulation');
          divCollection.textContent =
            userModulation[currentChannel] === 0 ? 'АМ' : 'ЧМ';
          return {
            currentMenu: 16,
            position,
          };
      }
      break;

    case 17:
      divCollection = document.getElementById('input_in_frequency_analogue');
      if (keyCode.search(/Digit/gi) !== -1 && textFrequencyTemp.length < 7) {
        digit = keyCode.replace('Digit', '');
        if (textFrequencyTemp.search(/[1-9]/gi) !== -1 || digit !== '0') {
          textFrequencyTemp += digit;
          divCollection.textContent = createFrequencyText(textFrequencyTemp);
        }
      } else {
        switch (keyCode) {
          case 'Escape':
            textFrequencyTemp = '';
            divCollection.textContent = createFrequencyText(textFrequencyTemp);
            return {
              currentMenu: 16,
              position,
            };

          case 'KeyM':
            textFrequencyTemp = textFrequencyTemp.slice(0, -1);
            divCollection.textContent = createFrequencyText(textFrequencyTemp);
            break;

          case 'Enter':
            if (
              getNumFrequency(divCollection.textContent) >= 0 &&
              getNumFrequency(divCollection.textContent) <= 11520 &&
              Number.isInteger(Number(textFrequencyTemp) / 12.5)
            ) {
              textFrequencyTemp = divCollection.textContent;
              userFrequencysIn[currentChannel] = getNumFrequency(
                divCollection.textContent
              );

              divCollection = document.getElementById(
                'old_input_out_frequency_analogue'
              );
              divCollection.textContent = getTextFrequency(
                userFrequencysOut[currentChannel]
              );

              divCollection = document.getElementById(
                'old_input_in_frequency_analogue'
              );
              divCollection.textContent = getTextFrequency(
                userFrequencysIn[currentChannel]
              );

              textFrequencyTemp = '';

              divCollection = document.getElementById(
                'input_in_frequency_analogue'
              );
              divCollection.textContent =
                createFrequencyText(textFrequencyTemp);

              return {
                currentMenu: 18,
                position,
              };
            }
        }
      }
      break;

    case 18:
      divCollection = document.getElementById('input_out_frequency_analogue');
      if (keyCode.search(/Digit/gi) !== -1 && textFrequencyTemp.length < 7) {
        digit = keyCode.replace('Digit', '');
        if (textFrequencyTemp.search(/[1-9]/gi) !== -1 || digit !== '0') {
          textFrequencyTemp += digit;
          divCollection.textContent = createFrequencyText(textFrequencyTemp);
        }
      } else {
        switch (keyCode) {
          case 'Escape':
            textFrequencyTemp = '';
            divCollection.textContent = createFrequencyText(textFrequencyTemp);
            return {
              currentMenu: 17,
              position,
            };

          case 'KeyM':
            textFrequencyTemp = textFrequencyTemp.slice(0, -1);
            divCollection.textContent = createFrequencyText(textFrequencyTemp);
            break;

          case 'Enter':
            if (
              getNumFrequency(divCollection.textContent) >= 0 &&
              getNumFrequency(divCollection.textContent) <= 11520 &&
              Number.isInteger(Number(divCollection.textContent) / 12.5)
            ) {
              userFrequencysOut[currentChannel] = getNumFrequency(
                divCollection.textContent
              );

              divCollection = document.getElementById(
                'old_input_out_frequency_analogue'
              );
              divCollection.textContent = getTextFrequency(
                userFrequencysOut[currentChannel]
              );

              textFrequencyTemp = '';

              divCollection = document.getElementById(
                'input_out_frequency_analogue'
              );
              divCollection.textContent =
                createFrequencyText(textFrequencyTemp);

              return {
                currentMenu: 19,
                position,
              };
            }
        }
      }
      break;

    case 19:
      divCollection = document.getElementById('chanel_width_analogue');
      switch (keyCode) {
        case 'Enter':
          textFrequencyTemp = '';
          return {
            currentMenu: 18,
            position,
          };

        case 'NumpadMultiply':
          if (userChannelWidth[currentChannel] > 0)
            userChannelWidth[currentChannel] = 0;
          divCollection = document.getElementById('chanel_width_analogue');
          divCollection.textContent = '12,5';
          return {
            currentMenu: 19,
            position,
          };

        case 'NumpadDivide':
          if (userChannelWidth[currentChannel] < 1)
            userChannelWidth[currentChannel] = 1;
          divCollection = document.getElementById('chanel_width_analogue');
          divCollection.textContent = '25';
          return {
            currentMenu: 19,
            position,
          };

        case 'KeyM':
          menuRadiostation.setFrequency();
          return {
            currentMenu: 2,
            position,
          };

        case 'Escape':
          if (userModulation[currentChannel] === 1) {
            textFrequencyTemp = getTextFrequency(
              userFrequencysIn[currentChannel]
            );

            if (textFrequencyTemp[textFrequencyTemp.length - 1] === 5) {
              userFrequencysIn[currentChannel] = getNumFrequency(
                Number(textFrequencyTemp) + 12.5
              );
            }

            textFrequencyTemp = getTextFrequency(
              userFrequencysOut[currentChannel]
            );

            if (textFrequencyTemp[textFrequencyTemp.length - 1] === 5) {
              userFrequencysOut[currentChannel] = getNumFrequency(
                Number(textFrequencyTemp) + 12.5
              );
            }
            textFrequencyTemp = '';
          }

          divCollection = document.getElementById(
            'old_input_out_frequency_analogue'
          );
          divCollection.textContent = getTextFrequency(
            userFrequencysOut[currentChannel]
          );

          divCollection = document.getElementById(
            'old_input_in_frequency_analogue'
          );
          divCollection.textContent = getTextFrequency(
            userFrequencysIn[currentChannel]
          );

          return {
            currentMenu: 20,
            position,
          };
      }
      break;

    case 20:
      divCollection = document.getElementById('power_analogue');
      switch (keyCode) {
        case 'Enter':
          textFrequencyTemp = '';
          return {
            currentMenu: 19,
            position,
          };

        case 'NumpadMultiply':
          divCollection.textContent = 'Номинальная';
          menuRadiostation.setPower(1);
          return {
            currentMenu: 20,
            position,
          };

        case 'NumpadDivide':
          divCollection.textContent = 'Повышенная';
          menuRadiostation.setPower(2);
          return {
            currentMenu: 20,
            position,
          };

        case 'KeyM':
          menuRadiostation.setFrequency();
          return {
            currentMenu: 2,
            position,
          };
      }
      break;

    case 21:
      switch (keyCode) {
        case 'Escape':
          volumeLevel = menuRadiostation.volume;
          changeVolume('graph_volume', 'digit_volume', volumeLevel);
          return {
            currentMenu: 0,
            position,
          };

        case 'Enter':
          menuRadiostation.volume = volumeLevel;
          menuRadiostation.setVolumeImg(volumeLevel);
          return {
            currentMenu: 0,
            position,
          };

        case 'Digit2':
          if (volumeLevel < 24) volumeLevel++;
          changeVolume('graph_volume', 'digit_volume', volumeLevel);
          return {
            currentMenu: 21,
            position,
          };

        case 'Digit8':
          if (volumeLevel > 0) volumeLevel--;
          changeVolume('graph_volume', 'digit_volume', volumeLevel);
          return {
            currentMenu: 21,
            position,
          };
      }
      break;

    case 22:
      if (keyCode === 'Escape')
        return {
          currentMenu: 0,
          position,
        };
      break;

    case 23:
      switch (keyCode) {
        case 'Escape':
          return {
            currentMenu: 24,
            position,
          };

        case 'KeyM':
          return {
            currentMenu: 2,
            position,
          };

        case 'NumpadMultiply':
          divCollection = document.getElementById('analogue_modulation_scan');
          divCollection.textContent = 'АМ';
          return {
            currentMenu: 23,
            position,
          };

        case 'NumpadDivide':
          divCollection = document.getElementById('analogue_modulation_scan');
          divCollection.textContent = 'ЧМ';
          return {
            currentMenu: 23,
            position,
          };
      }
      break;

    case 24:
      if (keyCode.search(/Digit/gi) !== -1) {
        digit = keyCode.replace('Digit', '');
        divCollection = document.getElementById('analogue_table_scan');
        divCollection.textContent = digit;
      } else {
        switch (keyCode) {
          case 'Enter':
            return {
              currentMenu: 23,
              position,
            };

          case 'Escape':
            return {
              currentMenu: 25,
              position,
            };

          case 'KeyM':
            return {
              currentMenu: 2,
              position,
            };
        }
      }
      break;

    case 25:
      switch (keyCode) {
        case 'Enter':
          return {
            currentMenu: 24,
            position,
          };

        case 'Escape':
          return {
            currentMenu: 26,
            position,
          };

        case 'KeyM':
          return {
            currentMenu: 2,
            position,
          };

        case 'NumpadMultiply':
          divCollection = document.getElementById('analogue_scan_scan');
          divCollection.textContent = 'Вкл';
          return {
            currentMenu: 25,
            position,
          };

        case 'NumpadDivide':
          divCollection = document.getElementById('analogue_scan_scan');
          divCollection.textContent = 'Выкл';
          return {
            currentMenu: 25,
            position,
          };
      }
      break;

    case 26:
      switch (keyCode) {
        case 'Enter':
          return {
            currentMenu: 25,
            position,
          };

        case 'Escape':
          return {
            currentMenu: 27,
            position,
          };

        case 'KeyM':
          return {
            currentMenu: 2,
            position,
          };

        case 'NumpadMultiply':
          divCollection = document.getElementById('chanel_width_analogue_scan');
          divCollection.textContent = '12,5';
          return {
            currentMenu: 26,
            position,
          };

        case 'NumpadDivide':
          divCollection = document.getElementById('chanel_width_analogue_scan');
          divCollection.textContent = '25';
          return {
            currentMenu: 26,
            position,
          };
      }
      break;

    case 27:
      switch (keyCode) {
        case 'Enter':
          return {
            currentMenu: 26,
            position,
          };

        case 'KeyM':
          return {
            currentMenu: 2,
            position,
          };

        case 'NumpadMultiply':
          divCollection = document.getElementById('analogue_scan_power');
          divCollection.textContent = 'Номинальная';
          return {
            currentMenu: 27,
            position,
          };

        case 'NumpadDivide':
          divCollection = document.getElementById('analogue_scan_power');
          divCollection.textContent = 'Повышенная';
          return {
            currentMenu: 27,
            position,
          };
      }
      break;

    case 28:
      switch (keyCode) {
        case 'Escape':
          return {
            currentMenu: 29,
            position,
          };

        case 'KeyM':
          return {
            currentMenu: 2,
            position,
          };

        case 'NumpadMultiply':
          divCollection = document.getElementById('protocol_digit_frch');
          divCollection.textContent = (divCollection.textContent == 'модем 1х' ||
            divCollection.textContent == 'модем 2х') ? 'модем 2х' : 'модем 1х';
          return {
            currentMenu: 28,
            position,
          };

        case 'NumpadDivide':
          divCollection = document.getElementById('protocol_digit_frch');
          divCollection.textContent = (divCollection.textContent == 'модем 1х' ||
            divCollection.textContent == 'голос') ? 'голос' : 'модем 1х';
          return {
            currentMenu: 28,
            position,
          };
      }
      break;

    case 29:
      divCollection = document.getElementById('input_in_frequency_frch');
      if (keyCode.search(/Digit/gi) !== -1 && textFrequencyTemp.length < 7) {
        digit = keyCode.replace('Digit', '');
        if (textFrequencyTemp.search(/[1-9]/gi) !== -1 || digit !== '0') {
          textFrequencyTemp += digit;
          divCollection.textContent = createFrequencyText(textFrequencyTemp);
        }
      } else {
        switch (keyCode) {
          case 'Escape':
            textFrequencyTemp = '';
            divCollection.textContent = createFrequencyText(textFrequencyTemp);
            return {
              currentMenu: 28,
              position,
            };

          case 'KeyM':
            textFrequencyTemp = textFrequencyTemp.slice(0, -1);
            divCollection.textContent = createFrequencyText(textFrequencyTemp);
            break;

          case 'Enter':
            if (
              getNumFrequency(divCollection.textContent) >= 0 &&
              getNumFrequency(divCollection.textContent) <= 11520 &&
              Number.isInteger(Number(textFrequencyTemp) / 12.5)
            ) {
              textFrequencyTemp = divCollection.textContent;
              userFrequencysIn[currentChannel] = getNumFrequency(
                divCollection.textContent
              );

              divCollection = document.getElementById(
                'old_input_out_frequency_frch'
              );
              divCollection.textContent = getTextFrequency(
                userFrequencysOut[currentChannel]
              );

              divCollection = document.getElementById(
                'old_input_in_frequency_frch'
              );
              divCollection.textContent = getTextFrequency(
                userFrequencysIn[currentChannel]
              );

              textFrequencyTemp = '';

              divCollection = document.getElementById(
                'input_in_frequency_frch'
              );
              divCollection.textContent =
                createFrequencyText(textFrequencyTemp);

              return {
                currentMenu: 30,
                position,
              };
            }
        }
      }
      break;

    case 30:
      divCollection = document.getElementById('input_out_frequency_frch');
      if (keyCode.search(/Digit/gi) !== -1 && textFrequencyTemp.length < 7) {
        digit = keyCode.replace('Digit', '');
        if (textFrequencyTemp.search(/[1-9]/gi) !== -1 || digit !== '0') {
          textFrequencyTemp += digit;
          divCollection.textContent = createFrequencyText(textFrequencyTemp);
        }
      } else {
        switch (keyCode) {
          case 'Escape':
            textFrequencyTemp = '';
            divCollection.textContent = createFrequencyText(textFrequencyTemp);
            return {
              currentMenu: 29,
              position,
            };

          case 'KeyM':
            textFrequencyTemp = textFrequencyTemp.slice(0, -1);
            divCollection.textContent = createFrequencyText(textFrequencyTemp);
            break;

          case 'Enter':
            if (
              getNumFrequency(divCollection.textContent) >= 0 &&
              getNumFrequency(divCollection.textContent) <= 11520 &&
              Number.isInteger(Number(divCollection.textContent) / 12.5)
            ) {
              userFrequencysOut[currentChannel] = getNumFrequency(
                divCollection.textContent
              );

              divCollection = document.getElementById(
                'old_input_out_frequency_frch'
              );
              divCollection.textContent = getTextFrequency(
                userFrequencysOut[currentChannel]
              );

              textFrequencyTemp = '';

              divCollection = document.getElementById(
                'input_out_frequency_frch'
              );
              divCollection.textContent =
                createFrequencyText(textFrequencyTemp);

              return {
                currentMenu: 31,
                position,
              };
            }
        }
      }
      break;

    case 31:
      divCollection = document.getElementById('tm_frch');
      if (keyCode.search(/Digit/gi) !== -1) {
        digit = keyCode.replace('Digit', '');
        if (divCollection.textContent.length < 3)
          divCollection.textContent += digit;
      } else {
        if (divCollection.textContent.length > 0)
          userFrch[channel].tm = Number(divCollection.textContent) > 255 ?
            255 : Number(divCollection.textContent);

        divCollection.textContent = '';
        switch (keyCode) {
          case 'Enter':
            return {
              currentMenu: 30,
              position,
            };

          case 'Escape':
            return {
              currentMenu: 32,
              position,
            };

          case 'KeyM':
            return {
              currentMenu: 2,
              position,
            };
        }
      }
      break;

    case 32:
      divCollection = document.getElementById('type_of_call_frch');
      switch (keyCode) {
        case 'Enter':
          return {
            currentMenu: 31,
            position,
          };

        case 'Escape':
          return {
            currentMenu: userFrch[channel].typeOfCall === 2 ? 34 : 33,
            position,
          };

        case 'KeyM':
          return {
            currentMenu: 2,
            position,
          };

        case 'NumpadMultiply':
          userFrch[channel].typeOfCall = (userFrch[channel].typeOfCall + 1) < 3 ?
            userFrch[channel].typeOfCall + 1 : userFrch[channel].typeOfCall;
          break;

        case 'NumpadDivide':
          userFrch[channel].typeOfCall = (userFrch[channel].typeOfCall - 1) >= 0 ?
            userFrch[channel].typeOfCall - 1 : userFrch[channel].typeOfCall;
          break;
      }
      divCollection.textContent = userFrch[channel].typeOfCall === 0 ? 'абонент' :
        userFrch[channel].typeOfCall === 1 ? 'группа' : 'циркулярный';
      break;

    case 33:
      divCollection = document.getElementById('number_of_call_frch');
      if (keyCode.search(/Digit/gi) !== -1) {
        digit = keyCode.replace('Digit', '');
        if ((userFrch[channel].typeOfCall === 0 && divCollection.textContent.length < 8) ||
          (userFrch[channel].typeOfCall === 1 && divCollection.textContent.length < 5)
        )
          divCollection.textContent += digit;
      } else {
        if (divCollection.textContent.length > 0)
          if (userFrch[channel].typeOfCall === 0) {
            userFrch[channel].numberOfCall = Number(divCollection.textContent) > 0 ?
              Number(divCollection.textContent) < 16777215 ?
                Number(divCollection.textContent) : 16777215 : 1;
          } else {
            userFrch[channel].numberOfCall = Number(divCollection.textContent) > 0 ?
              Number(divCollection.textContent) < 65534 ?
                Number(divCollection.textContent) : 65534 : 1;
          }

        divCollection.textContent = '';
        switch (keyCode) {
          case 'Enter':
            return {
              currentMenu: 32,
              position,
            };

          case 'Escape':
            return {
              currentMenu: 34,
              position,
            };

          case 'KeyM':
            return {
              currentMenu: 2,
              position,
            };
        }
      }
      break;

    case 34:
      divCollection = document.getElementById('group_frch');
      if (keyCode.search(/Digit/gi) !== -1) {
        digit = keyCode.replace('Digit', '');
        if (divCollection.textContent.length < 5)
          divCollection.textContent += digit;
      } else {
        if (divCollection.textContent.length > 0)
          userFrch[channel].group = Number(divCollection.textContent) > 0 ?
            Number(divCollection.textContent) < 65534 ?
              Number(divCollection.textContent) : 65534 : 1;

        divCollection.textContent = '';
        switch (keyCode) {
          case 'Enter':
            return {
              currentMenu: 33,
              position,
            };

          case 'Escape':
            return {
              currentMenu: 35,
              position,
            };

          case 'KeyM':
            return {
              currentMenu: 2,
              position,
            };
        }
      }
      break;

    case 35:
      divCollection = document.getElementById('abonent_frch');
      if (keyCode.search(/Digit/gi) !== -1) {
        digit = keyCode.replace('Digit', '');
        if (divCollection.textContent.length < 8)
          divCollection.textContent += digit;
      } else {
        if (divCollection.textContent.length > 0)
          userFrch[channel].abonent = Number(divCollection.textContent) > 0 ?
            Number(divCollection.textContent) < 16777215 ?
              Number(divCollection.textContent) : 16777215 : 1;

        divCollection.textContent = '';
        switch (keyCode) {
          case 'Enter':
            return {
              currentMenu: 34,
              position,
            };

          case 'Escape':
            return {
              currentMenu: 36,
              position,
            };

          case 'KeyM':
            return {
              currentMenu: 2,
              position,
            };
        }
      }
      break;

    case 36:
      divCollection = document.getElementById('power_frch');
      switch (keyCode) {
        case 'NumpadMultiply':
          divCollection.textContent = 'Номинальная';
          menuRadiostation.setPower(1);
          break;

        case 'NumpadDivide':
          divCollection.textContent = 'Повышенная';
          menuRadiostation.setPower(2);
          break;

        case 'Enter':
          return {
            currentMenu: 35,
            position,
          };

        case 'KeyM':
          return {
            currentMenu: 2,
            position,
          };
      }
      break;
  }
  return null;
}
