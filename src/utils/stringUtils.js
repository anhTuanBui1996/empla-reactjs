export function getRandomColor() {
  let letters = "0123456789ABCDEF";
  let color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const upperCaseLetter = "ABCDEFGHIJKLMNOPQRSTUVWYZ";
const specialCharacter = "!@#$%^&*()-_+={[}]|:;'<,>./?";
export function parseFieldName(fieldName) {
  let newString = fieldName[0].toUpperCase();
  for (let i = 1; i < fieldName.length; i++) {
    let character = fieldName[i];
    let previousCharacter = fieldName[i - 1];
    if (upperCaseLetter.indexOf(character) !== -1) {
      if (specialCharacter.indexOf(previousCharacter) !== -1) {
        newString += ` ${previousCharacter}${character}`;
      } else {
        newString += ` ${character}`;
      }
    } else if (
      specialCharacter.indexOf(character) === -1 ||
      i === fieldName.length - 1
    ) {
      newString += character;
    }
  }
  return newString;
}
