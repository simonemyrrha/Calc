############################
#   Flashing_Background    #
#  Random flashing colors  #
############################

/** Initialize a new sheet api */
var sheet = SpreadSheet.getActiveSheet();

function randomRgbColor() {
  return (Math.floor(Math.random() * 255) + 1);
};

/**
 * Flashes the background with random colors
 */
function flashingBackground() {

  /** Get the current users view each call */
  var range = new sheet.Range(sheet.getView());

  range.set("BackgroundColor", "rgb(" + randomRgbColor() + "," + randomRgbColor() +", " + randomRgbColor() + ")");

  /** Redraw the sheet, since styling only changes were made */
  sheet.redraw();

};

flashingBackground();

setInterval(flashingBackground, 1000);