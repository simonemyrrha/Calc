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
   * Room class
   * Represents a user room
   */
  function Room(name, owner, token, id) {
    /**
     * Mongo room id
     *
     * @member {string}
     */
    this.id = id;
    /**
     * Room name
     *
     * @member {string}
     */
    this.name = name;
    /**
     * Name of the owner
     *
     * @member {string}
     */
    this.owner = owner;
    /**
     * Users in this room
     *
     * @member {array}
     */
    this.users = [];
    /**
     * Max room user amount
     *
     * @member {number}
     * @default 12
     */
    this.userLimit = 12;
    /**
     * Security access token
     *
     * @member {string}
     */
    this.securityToken = token;
    /**
     * Sheets
     * Structure: sheet[a-Z+0-9] -> cellAlphabet[a-Z] -> cell[a-Z+0-9]
     *
     * @member {object}
     */
    this.sheets = {};
  };

  /**
   * Check if a user is in this room
   * @param {string} username Username
   * @method userExists
   * @return {boolean}
   */
  Room.prototype.userExists = function(username) {

    for (var ii = 0; ii < this.users.length; ++ii) {
      if (this.users[ii].username === username) return (true);
    }

    return (false);

  };

  /**
   * Check if user is the room owner
   * @param {string} username Username
   * @method isOwner
   * @return {boolean}
   */
  Room.prototype.isOwner = function(username) {

    for (var ii = 0; ii < this.users.length; ++ii) {
      if (this.users[ii].owner >= 3) return (true);
    }

    return (false);

  };

  /**
   * Adds a new user to the room
   * @param {object} user User
   * @method addUser
   */
  Room.prototype.addUser = function(username) {

    /** Validate username */
    if (!username || !typeof username === "string") return (false);

    /** Check if user already exists in this room, continue if not */
    if (!this.userExists(username)) {
      this.users.push(username);
    }

    return void 0;

  };

  /**
   * Removes a user from the room
   * @param {string} username Username
   * @method removeUser
   */
  Room.prototype.removeUser = function(username) {

    for (var ii = 0; ii < this.users.length; ++ii) {
      if (this.users[ii] === username) {
        this.users.splice(ii, 1);
      }
    }

    return void 0;

  };

  /**
   * Check if room is empty
   * @method isEmpty
   * @return {boolean}
   */
  Room.prototype.isEmpty = function() {

    if (this.users.length <= 0) return (true);

    return (false);

  };

  /**
   * Check if room is full
   * @method isFull
   * @return {boolean}
   */
  Room.prototype.isFull = function() {

    if (this.users.length >= this.userLimit) return (true);

    return (false);

  };

  /**
   * Count users in this room
   * @method countUsers
   * @return {number} User count
   */
  Room.prototype.countUsers = function() {

    return (this.users.length || 0);

  };

  /**
   * Check if a sheet exists
   * @param {string} name Sheet name
   * @return {boolean}
   * @method sheetExists
   */
  Room.prototype.sheetExists = function(name) {

    if (this.sheets.hasOwnProperty(name)) return (true);

    return (false);

  };

  /**
   * Create a sheet in this room
   * @param {string} name Sheet name
   * @method createSheet
   */
  Room.prototype.createSheet = function(name) {

    /** Abort if sheet already exists */
    if (this.sheets.hasOwnProperty(name)) return void 0;

    /** Create a virgin sheet object */
    this.sheets[name] = {
      /** Cell object */
      cells: {},
      /** Resize object */
      resize: {
        columns: {},
        rows: {}
      },
      /** Master object */
      master: {
        columns: {},
        rows: {}
      }
    };

  };

  module.exports = Room;