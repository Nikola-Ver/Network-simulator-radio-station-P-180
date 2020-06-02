function rmeoveAllId(divCollection, pos) {
  for (let i = pos; i < divCollection.length; i++)
    if (divCollection[i].id !== "block") divCollection[i].id = "";
}

function menu(currentMenu, position, keyCode) {
  let pos = position;
  let divCollection = null;
  switch (currentMenu) {
    case 0:
      switch (keyCode) {
        case "KeyM":
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
              return {
                currentMenu: 1,
                position,
              };
            case 1:
              return {
                currentMenu: 1,
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
  }
  return null;
}
