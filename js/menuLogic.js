// -1 = current directory

function menu(directory, posistion, keyCode) {
  switch (directory[0]) {
    case -1:
      if (keyCode === "KeyM")
        return {
          currentDirectory: [0, -1, -1],
          currentMenu: 1,
          posistion: 0,
        };
      return {
        currentDirectory: [-1, -1, -1],
        currentMenu: 0,
        posistion: posistion,
      };

    case 0:
      switch (directory[1]) {
        case -1:
          switch (keyCode) {
            case "Escape":
              return {
                currentDirectory: [-1, -1, -1],
                currentMenu: 0,
                posistion: posistion,
              };
          }
          return {
            currentDirectory: [0, -1, -1],
            currentMenu: 1,
            posistion: posistion,
          };

        case 0:
          break;
        case 1:
          break;
        case 2:
          break;
        case 3:
          break;
      }
      break;
    case 1:
      switch (directory[1]) {
        case -1:
          break;
        case 0:
          break;
        case 1:
          break;
        case 2:
          break;
        case 3:
          break;
      }
      break;
    case 2:
      switch (directory[1]) {
        case -1:
          break;
        case 0:
          break;
        case 1:
          break;
      }
      break;
    case 3:
      switch (directory[1]) {
        case -1:
          break;
        case 0:
          break;
        case 1:
          break;
        case 2:
          break;
        case 3:
          break;
      }
      break;
    case 4:
      break;
  }
}
