/**
 * This file is part of the NovaeCalc project.
 *
 * It is permitted to use, redistribute and/or modify this software
 * under the terms of the MIT License
 *
 * @author Felix Maier <maier.felix96@gmail.com>
 * @copyright (c) 2015 Felix Maier, @felixmaier
 *
 * You may not change or remove these lines
 *
 */

"use strict";

  /**
   * Get the outer of a cell selection
   *
   * @method getOuterSelection
   * @static
   */
  CORE.Selector.prototype.getOuterSelection = function() {

    var first = this.Selected.First;
    var last = this.Selected.Last;

    var object = {
      top: [],
      bottom: [],
      left: [],
      right: []
    };

    /** Minimum field size: 2x2 */
    for (var ii = 0; ii < this.SelectedCells.length; ++ii) {
      /** Get outer left */
      if (first.Letter === this.SelectedCells[ii].letter) {
        object.left.push(this.SelectedCells[ii]);
      }
      /** Get outer right */
      if (last.Letter === this.SelectedCells[ii].letter) {
        object.right.push(this.SelectedCells[ii]);
      }
      /** Get outer top */
      if (first.Number === this.SelectedCells[ii].number) {
        object.top.push(this.SelectedCells[ii]);
      }
      /** Get outer bottom */
      if (last.Number === this.SelectedCells[ii].number) {
        object.bottom.push(this.SelectedCells[ii]);
      }
    }

    return (object);

  };

  /**
   * Draw a border of a object
   *
   * @method drawOuterBorder
   * @static
   */
  CORE.Selector.prototype.drawOuterBorder = function() {

    var object = this.getOuterSelection();

    var cacheTarget = "";

    var letter = "";

    /** Top */
    for (var ii = 0; ii < object.top.length; ++ii) {
      letter = CORE.$.numberToAlpha(object.top[ii].letter);
      cacheTarget = CORE.Cells.Used[letter][letter + object.top[ii].number];
      cacheTarget.Border.used = true;
      cacheTarget.Border.top = true;
    }

    /** Bottom */
    for (var ii = 0; ii < object.bottom.length; ++ii) {
      letter = CORE.$.numberToAlpha(object.bottom[ii].letter);
      cacheTarget = CORE.Cells.Used[letter][letter + object.bottom[ii].number];
      cacheTarget.Border.used = true;
      cacheTarget.Border.bottom = true;
    }

    /** Left */
    for (var ii = 0; ii < object.left.length; ++ii) {
      letter = CORE.$.numberToAlpha(object.left[ii].letter);
      cacheTarget = CORE.Cells.Used[letter][letter + object.left[ii].number];
      cacheTarget.Border.used = true;
      cacheTarget.Border.left = true;
    }

    /** Right */
    for (var ii = 0; ii < object.right.length; ++ii) {
      letter = CORE.$.numberToAlpha(object.right[ii].letter);
      cacheTarget = CORE.Cells.Used[letter][letter + object.right[ii].number];
      cacheTarget.Border.used = true;
      cacheTarget.Border.right = true;
    }

    CORE.Grid.updateWidth("default");

  };

  /**
   * Jump a specific amount into a specific axis
   *
   * @method jump
   * @static
   */
  CORE.Selector.prototype.jump = function(direction, amount) {

    switch (direction) {
      case "up":
        CORE.Grid.Settings.scrolledY -= amount >= 0 ? (amount - 1) : 0;
        break;
      case "down":
        CORE.Grid.Settings.scrolledY += (amount - 1);
        break;
    }

    CORE.Grid.updateHeight(direction, amount);
    CORE.Grid.updateMenu();
    CORE.Selector.getSelection();
    CORE.Selector.selectCellByKeyPress();
    CORE.Event.lastAction.scrollY = true;

  };