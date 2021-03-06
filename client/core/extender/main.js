/**
 * This file is part of the Calc project.
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
   * The Extender
   *
   * @class Extender
   * @static
   */
  NOVAE.Extender = function() {};

  NOVAE.Extender.prototype = NOVAE.Extender;
  NOVAE.Extender.prototype.constructor = NOVAE.Extender;

  /**
   * Extend selected cells
   *
   * @method extend
   * @static
   */
  NOVAE.Extender.prototype.extend = function() {

    /** Short syntax */
    var SelectedCells = NOVAE.Sheets[NOVAE.CurrentSheet].Selector.SelectedCells;

    var Cells = [];

    /** Save values of cells here */
    var extendStack = {};

    /** Extend mode */
    var mode = null;

    var Columns = {};

    /** Go through all selected cells */
    for (var ii = 0; ii < SelectedCells.length; ++ii) {

      var letter = NOVAE.$.numberToAlpha(SelectedCells[ii].letter);
      var number = SelectedCells[ii].number;

      /** Direct cell pointer */
      var cell = NOVAE.Cells.Used[NOVAE.CurrentSheet][letter];

      /** Column doesnt exist yet */
      if (!Columns[letter]) Columns[letter] = {
        array: [],
        mode: null
      };

      /** Extend stack column doesnt exist yet */
      if (!extendStack[letter]) extendStack[letter] = [];

      /** Cell has content */
      if (cell && cell[letter + number]) {
        cell = cell[letter + number];
        /** Formula */
        if (cell.Formula && cell.Formula.Lexed !== null) {
          if (Columns[letter].mode === null) {
            /** Its a formula */
            Columns[letter].mode = "formula";
          }
          /** Only push 2 values */
          if (extendStack[letter].length < 2) {
            extendStack[letter].push({name: {letter: letter, number: number}, value: cell.Formula.Lexed});
          }
        /** Content */
        } else {
          if (cell.Content !== undefined && cell.Content !== null) {
            if (Columns[letter].mode === null) {
              /** Its a number */
              if (!isNaN(cell.Content)) Columns[letter].mode = "numeric";
              else Columns[letter].mode = "string";
            }
            /** Only push 2 values */
            if (extendStack[letter].length < 2) {
              extendStack[letter].push(cell.Content);
            }
          }
        }
        /** Get the cells content */
        Columns[letter].array.push({
          letter: SelectedCells[ii].letter,
          number: SelectedCells[ii].number,
          value: cell.Content
        });
      /** Empty cell */
      } else {
        Columns[letter].array.push({
          letter: SelectedCells[ii].letter,
          number: SelectedCells[ii].number,
          value: null
        });
      }
    }

    /** Abort if nothing to extend */
    if (!Object.keys(Columns).length) return void 0;

    /** Extend */
    for (var ii in Columns) {
      if (extendStack[ii]) {
        if (Columns[ii].mode === "numeric") {
          this.extendNumbers(Columns[ii].array, extendStack[ii]);
        } else if (Columns[ii].mode === "string") {
          this.extendStrings(Columns[ii].array, extendStack[ii]);
        } else if (Columns[ii].mode === "formula") {
          this.extendFormulas(Columns[ii].array, extendStack[ii]);
        }
      }
    }

  };

  /**
   * Create an extend button and return it
   *
   * @method getExtendButton
   * @static
   */
  NOVAE.Extender.prototype.getExtendButton = function() {

    var self = this;

    var extendButton = document.createElement("button");
      extendButton.className = "extendButton";
      extendButton.addEventListener(NOVAE.Events.mouseDown, function(e) {
        /** User started to extend */
        NOVAE.Sheets[NOVAE.CurrentSheet].Input.Mouse.Extend = true;
      });

      extendButton.addEventListener(NOVAE.Events.mouseMove, function(e) {
        e.target.style.cursor = "crosshair";
      });

    return (extendButton);

  };

  /**
   * Update processed cells
   *
   * @method updateCells
   * @static
   */
  NOVAE.Extender.prototype.updateCells = function(Cells) {

    for (var ii = 0; ii < Cells.length; ++ii) {
      var letter = NOVAE.$.numberToAlpha(Cells[ii].letter);
      var number = Cells[ii].number;
      if (NOVAE.Cells.Used[NOVAE.CurrentSheet][letter]) {
        if (!NOVAE.Cells.Used.cellExists(letter + number, NOVAE.CurrentSheet)) {
          NOVAE.Cells.Used.registerCell(letter + number, NOVAE.CurrentSheet);
        }
        NOVAE.Cells.Used.updateCell(letter + number, {property: "Content", value: Cells[ii].value}, NOVAE.CurrentSheet);
      }
    }

  };