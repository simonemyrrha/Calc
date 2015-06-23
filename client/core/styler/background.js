/**
 * This file is part of the NovaeCalc project.
 *
 * It is permitted to use, redistribute and/or modify this software
 * under the terms of the BSD License
 *
 * @author Felix Maier <maier.felix96@gmail.com>
 * @copyright (c) 2015 Felix Maier, @felixmaier
 *
 * You may not change or remove these lines
 *
 */

"use strict";

  /**
   * Change background style
   *
   * @method backgroundStyle
   * @static
   */
  NOVAE.Styler.prototype.backgroundStyle = function(color) {

    var selectSheet = NOVAE.Sheets[NOVAE.CurrentSheet].Selector;

    var element = NOVAE.DOM.ChangeCellBackground.children[1];

    /** Shorter syntax */
    var masterCell = selectSheet.masterSelected;
    var currentMaster = masterCell.Current;

    /** Active master selection */
    if (masterCell.Current && masterCell.Current !== null) {
      if (NOVAE.Sheets[NOVAE.CurrentSheet].isMasterSheet()) {
        this.inheritSheetMasterStyling("BackgroundColor", color, masterCell.Current);
      }
      masterCell = masterCell.Columns[masterCell.Current] || masterCell.Rows[masterCell.Current];
      /** Check if master cell exists */
      if (masterCell) {
        masterCell.BackgroundColor = color;
      }
    }

    /** Validate all selected cells */
    NOVAE.$.validateCells();

    /** Overwrite used cells styling, if active master selection */
    if (NOVAE.Cells.Used[NOVAE.CurrentSheet][currentMaster]) {
      selectSheet.inheritMasterStyling(currentMaster, masterCell, "BackgroundColor");
    }

    /** Create background style command */
    this.backgroundStyleCommand(color);

    /** Append the background style */
    this.appendBackgroundStyle(color);

    /** Inherit style changes to slave sheets */
    if (NOVAE.Sheets[NOVAE.CurrentSheet].isMasterSheet()) {
      this.inheritSheetStyling("BackgroundColor", color);
    }

    /** Dont loose the selection */
    selectSheet.getSelection();

  };

  /**
   * Append the background style
   *
   * @method appendBackgroundStyle
   * @static
   */
  NOVAE.Styler.prototype.appendBackgroundStyle = function(color) {

    var selectedCells = arguments[1] || NOVAE.Sheets[NOVAE.CurrentSheet].Selector.SelectedCells;

    /** Loop through all selected cells */
    for (var ii = 0; ii < selectedCells.length; ++ii) {
      var letter = NOVAE.$.numberToAlpha(selectedCells[ii].letter);
      var name = letter + selectedCells[ii].number;
      /** Update the cell background color */
      NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][name].BackgroundColor = color;
      /** Immediately update cells background color */
      var jumps = NOVAE.$.getCell({ letter: selectedCells[ii].letter, number: selectedCells[ii].number });
      if (jumps >= 0) NOVAE.DOM.Output.children[jumps].style.background = color;
    }

  };

  /**
   * Convert background style action into command
   *
   * @method backgroundStyleCommand
   * @static
   */
  NOVAE.Styler.prototype.backgroundStyleCommand = function(color) {

    var selector = NOVAE.Sheets[NOVAE.CurrentSheet].Selector;

    /** Get the old color */
    var getColor = selector.SelectedCells[0];
    var getColorLetter = NOVAE.$.numberToAlpha(getColor.letter);
    var getColorNumber = getColor.number;
    getColor = NOVAE.Cells.Used[NOVAE.CurrentSheet][getColorLetter][getColorLetter + getColorNumber].BackgroundColor;

    /** Push change into undo stack */
    var command = NOVAE.newCommand();
        command.caller = "Styler";
        command.action = "BackgroundColor";
        command.data = {
          newColor: color,
          oldColor: getColor,
          range: {
            first: selector.SelectedCells[0],
            last: selector.SelectedCells[selector.SelectedCells.length - 1]
          }
        };

    /** Push command into the commander stack */
    NOVAE.Sheets[NOVAE.CurrentSheet].Commander.pushUndoCommand(command, true);

  };