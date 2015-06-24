/** Initialize a new sheet api */
var sheet = SpreadSheet.getActiveSheet();

function randomRgbColor() {
  return (Math.floor(Math.random() * 255) + 1);
};

/**
 * Flashes the background with random colors
 */
function flashingBackground() {

  /** Create a new range */
  var range = new sheet.Range("A1:S50");

  /** Direct range property change */
  var value1 = randomRgbColor();
  var value2 = randomRgbColor();
  var value3 = randomRgbColor();

  range.set("BackgroundColor", "rgb(" + value1 + "," + value2 +", " + value3 + ")");

  /** Redraw the sheet, since changes were made */
  sheet.redraw();

};

flashingBackground();

setInterval(flashingBackground, 1000);