export function getRandomColor() {
  let letters = "0123456789ABCDEF";
  let color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const upperCaseLetter = "ABCDEFGHIJKLMNOPQRSTUVWYZ";
export function parseFieldName(fieldName) {
  let newString = "";
  for (let i = 1; i < fieldName.length; i++) {
    let character = fieldName[i];
    if (upperCaseLetter.indexOf(character) !== -1) {
      newString += ` ${character}`;
    } else {
      newString += character;
    }
  }
  return newString;
}
