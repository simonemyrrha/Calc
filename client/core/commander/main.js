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
   * The Commander
   *
   * @class Commander
   * @static
   */
  NOVAE.Commander = function() {

    this.Stack = {
      /** Save DO commands */
      redoCommands: [],
      /** Save UNDO commands */
      undoCommands: []
    };

    this.Settings = {
      /** Maximum redo amount */
      maxRedo: 100,
      /** Maximum undo amount */
      maxUndo: 100,
      /** Current redo stack position */
      redoPosition: 0,
      /** Current undo stack position */
      undoPosition: 0
    };

  };

  NOVAE.Commander.prototype = NOVAE.Commander;
  NOVAE.Commander.prototype.constructor = NOVAE.Commander;

  /**
   * Redo
   *
   * @method redo
   * @static
   */
  NOVAE.Commander.prototype.redo = function() {

    /** Limited undo stack size.. */
    if ( (this.Stack.redoCommands.length + 1) >= this.Settings.maxRedo ) {
      /** Remove oldest redo command */
      this.Stack.redoCommands.shift();
    }

    var redoCommand = this.lastRedoCommand();

    if (redoCommand) {

      this.executeCommand(redoCommand, 1);

      this.pushUndoCommand(redoCommand);

    }

  };

  /**
   * Undo
   *
   * @method undo
   * @static
   */
  NOVAE.Commander.prototype.undo = function() {

    /** Limited undo stack size.. */
    if ( (this.Stack.undoCommands.length + 1) >= this.Settings.maxUndo ) {
      /** Remove oldest undo command */
      this.Stack.undoCommands.shift();
    }

    var undoCommand = this.lastUndoCommand();

    if (undoCommand) {

      this.executeCommand(undoCommand, 0);

      this.pushRedoCommand(undoCommand);

    }

  };

  /**
   * Push a REDO command into the stack
   *
   * @param {object} [cmd] Command
   * @param {boolean} [strict] Break undo pipeline if command from the grid
   * @method pushRedoCommand
   * @static
   */
  NOVAE.Commander.prototype.pushRedoCommand = function(cmd, strict) {

    /** Clean redo stack if user was in redo pipeline */
    if (strict) this.breakUndoPipeline();

    this.Stack.redoCommands.push(cmd);

  };

  /**
   * Push a UNDO command into the stack
   *
   * @param {object} [cmd] Command
   * @param {boolean} [strict] Break redo pipeline if command from the grid
   * @method pushUndoCommand
   * @static
   */
  NOVAE.Commander.prototype.pushUndoCommand = function(cmd, strict) {

    /** Clean redo stack if user was in undo pipeline */
    if (strict) this.breakRedoPipeline();

    this.Stack.undoCommands.push(cmd);

  };

  /**
   * Shift the REDO command stack
   *
   * @method lastRedoCommand
   * @return {object} [Command]
   * @static
   */
  NOVAE.Commander.prototype.lastRedoCommand = function() {

    if (this.Stack.redoCommands.length) {
      return (this.Stack.redoCommands.pop());
    }

    return void 0;

  };

  /**
   * Shift the UNDO command stack
   *
   * @method lastUndoCommand
   * @return {object} [Command]
   * @static
   */
  NOVAE.Commander.prototype.lastUndoCommand = function() {

    if (this.Stack.undoCommands.length) {
      return (this.Stack.undoCommands.pop());
    }

    return void 0;

  };

  /**
   * Clear redo pipeline if commands inside
   *
   * @method breakRedoPipeline
   * @return {boolean}
   * @static
   */
  NOVAE.Commander.prototype.breakRedoPipeline = function() {

    /** Clean redo stack */
    if (this.Stack.redoCommands.length) {
      this.Stack.redoCommands = [];
      return (true);
    }

    return (false);

  };

  /**
   * Clear undo pipeline if commands inside
   *
   * @method breakUndoPipeline
   * @return {boolean}
   * @static
   */
  NOVAE.Commander.prototype.breakUndoPipeline = function() {

    /** Clean undo stack */
    if (this.Stack.undoCommands.length) {
      this.Stack.undoCommands = [];
      return (true);
    }

    return (false);

  };

  /**
   * Execute command
   *
   * @param {object} [cmd] Command
   * @param {number} [mode] Reversed or not
   * @method executeCommand
   * @static
   */
  NOVAE.Commander.prototype.executeCommand = function(cmd, mode) {

    /** Nothing to undo */
    if (!cmd) return void 0;

    switch (cmd.caller) {
      case "Selector":
        switch (cmd.action) {
          case "select":
            this.reverseSelection(cmd.data);
            break;
        }
        break;
      case "Resize":
        this.reverseResize(cmd.data);
        break;
      case "Styler":
        switch (cmd.action) {
          case "BackgroundColor":
            this.reverseBackgroundStyling(cmd.data, mode);
            break;
        }
        break;
      case "Injector":
        this.reverseInsertion(cmd, mode);
        break;
    }

  };

  /**
   * Get a earlier command
   *
   * @param {number} [jump] How many times to ignore found commands until return them
   * @param {string} [caller] Caller to search
   * @param {string} [action] Action to search
   * @method getEarlierCommand
   * @return {object} Undo stack command
   * @static
   */
  NOVAE.Commander.prototype.getEarlierCommand = function(jump, caller, action) {

    var jumps = jump;

    var command = null;

    var counter = this.Stack.undoCommands.length;

    while (true) {
      if (this.Stack.undoCommands[counter] &&
          this.Stack.undoCommands[counter].caller === caller &&
          this.Stack.undoCommands[counter].action === action) {
        command = this.Stack.undoCommands[counter];
        if (jump <= 0) break;
        jump--;
      }
      if (counter < 0) break;
      counter--;
    }

    if (command) {
      return (command);
    } else return void 0;

  };