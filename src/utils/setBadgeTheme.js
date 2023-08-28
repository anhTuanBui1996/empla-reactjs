export function setBadgeTheme(colorName, styles) {
  switch (colorName) {
    case "blueLight2":
      styles.backgroundColor = "#d1e2ff";
      break;
    case "cyanLight2":
      styles.backgroundColor = "#c4ecff";
      break;
    case "tealLight2":
      styles.backgroundColor = "#c1f5f0";
      break;
    case "greenLight2":
      styles.backgroundColor = "#cff5d1";
      break;
    case "yellowLight2":
      styles.backgroundColor = "#ffeab6";
      break;
    case "orangeLight2":
      styles.backgroundColor = "#ffe0cc";
      break;
    case "redLight2":
      styles.backgroundColor = "#ffd4e0";
      break;
    case "pinkLight2":
      styles.backgroundColor = "#fad2fc";
      break;
    case "purpleLight2":
      styles.backgroundColor = "#e0dafd";
      break;
    case "grayLight2":
      styles.backgroundColor = "#e5e9f0";
      break;
    case "blueBright":
      styles.color = "white";
      styles.backgroundColor = "#166ee1";
      break;
    case "pinkLight1":
      styles.backgroundColor = "#f797ef";
      break;
    default:
      console.log("Unknown color!", colorName);
      break;
  }
  return styles;
}
