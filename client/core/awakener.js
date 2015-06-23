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
   * Awakener, to handle live cells
   *
   * @class Awakener
   * @static
   */
  NOVAE.Awakener = function() {

    /** Save all running live cells here */
    this.currentlyRunning = {};

  };

  NOVAE.Awakener.prototype = NOVAE.Awakener;

  /**
   * Process live cells
   *
   * @method evalLive
   * @static
   */
  NOVAE.Awakener.prototype.evalLive = function() {

    for (var ii in NOVAE.Cells.Live) {
      /** Check for valid url */
      if (NOVAE.Cells.Live[ii].Url) {
        this.asleep(ii);
        this.awake(ii);
      }
    }

  };

  /**
   * Wake up a cell
   *
   * @method awake
   * @static
   */
  NOVAE.Awakener.prototype.awake = function(name) {

    /** Async this fix */
    var self = this;

    /** Live cell exists and is active */
    if (NOVAE.Cells.Live[name] && !NOVAE.Cells.Live[name].Active) {
      /** Set live cell to active */
      NOVAE.Cells.Live[name].Active = true;
      /** Attach timeout */
      this.currentlyRunning[name] = setInterval(function() {
        /** Dont refresh if user is in edit mode */
        if (!NOVAE.Sheets[NOVAE.CurrentSheet].Input.Mouse.Edit) self.get(name);
      }, NOVAE.Cells.Live[name].RefreshTime);
    }

  };

  /**
   * Stop a live cell
   *
   * @method asleep
   * @static
   */
  NOVAE.Awakener.prototype.asleep = function(name) {
    if (this.currentlyRunning[name]) {
      /** Stop fetching data */
      window.clearInterval(this.currentlyRunning[name]);
      /** Deactivate it to allow reuse */
      NOVAE.Cells.Live[name].Active = false;
    }
  };

  /**
   * Get data from a live cell
   *
   * @method get
   * @static
   */
  NOVAE.Awakener.prototype.get = function(name) {

    /** Async this fix */
    var self = this;

    AJAX.GET(NOVAE.Cells.Live[name].Url, function(data) {
      NOVAE.Cells.Live[name].Data = data;
      /** Go on */
      self.processData(name);
    });

  };

  /**
   * Process a live cells received data
   *
   * @method processData
   * @static
   */
  NOVAE.Awakener.prototype.processData = function(name) {

    var letter = name.match(NOVAE.REGEX.numbers).join("");

    /** Check if we go some data */
    if (NOVAE.Cells.Live[name].Data && NOVAE.Cells.Live[name].Data.length) {
      /** Try to attach it to its attendant cell */
      if (!NOVAE.Cells.Used[letter][name]) NOVAE.registerCell(name);
      /** If data is JSON, parse and attach it */
      if (NOVAE.$.isJSON(NOVAE.Cells.Live[name].Data)) {
        NOVAE.Cells.Live[name].Data = JSON.parse(NOVAE.Cells.Live[name].Data);
      }
      NOVAE.eval();
    }

  };

  /**
   * Reset all live cells to inactive
   *
   * @method reset
   * @static
   */
  NOVAE.Awakener.prototype.reset = function() {

    for (var ii in NOVAE.Cells.Live) {
      NOVAE.Cells.Live[ii].Active = false;
    }

  };