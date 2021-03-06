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

Import.scripts = [
  /** Libraries */
  "lib/fastclick.min.js",
  "lib/ajax.min.js",
  "lib/eight-bit-color-picker.min.js",
  "lib/socket.io.min.js",
  "lib/codemirror.js",
  "lib/material.min.js",
  "lib/vm.min.js",
  /** Polyfills */
  "core/polyfill.js",
  /** Menu */
  "core/ui/main.js",
  "core/ui/menu.js",
  "core/ui/action.js",
  "core/ui/settings.js",
  "core/ui/modal.js",
  /** Menu cell styling */
  "core/ui/style/border.js",
  "core/ui/style/font.js",
  "core/ui/style/background.js",
  "core/ui/style/live.js",
  "core/ui/style/inject.js",
  "core/ui/style/update.js",
  /** Run the core */
  "core/main.js",
  "core/dom.js",
  "core/eval.js",
  "core/storage.js",
  "core/used.js",
  /** Input */
  "core/event/main.js",
  "core/event/animate.js",
  "core/event/mouse.js",
  "core/event/key.js",
  "core/event/sniffer.js",
  "core/event/scroll.js",
  /** Speed tester */
  "core/speedy/main.js",
  /** Sheet */
  "core/sheet/main.js",
  /** Grid */
  "core/grid/main.js",
  "core/grid/cache.js",
  "core/grid/menu/main.js",
  "core/grid/menu/column.js",
  "core/grid/menu/row.js",
  "core/grid/update.js",
  "core/grid/cell.js",
  /** Injector */
  "core/injector/main.js",
  "core/injector/insert.js",
  "core/injector/delete.js",
  /** Extender */
  "core/extender/main.js",
  "core/extender/formula.js",
  "core/extender/numeric.js",
  "core/extender/string.js",
  /** Selector */
  "core/selector/main.js",
  "core/selector/hover.js",
  "core/selector/key.js",
  "core/selector/menu.js",
  "core/selector/select.js",
  "core/selector/functions.js",
  "core/selector/master.js",
  /** Commander */
  "core/commander/main.js",
  "core/commander/command.js",
  "core/commander/reverse.js",
  "core/commander/sheet.js",
  /** Styler */
  "core/styler/main.js",
  "core/styler/inherit.js",
  "core/styler/background.js",
  "core/styler/border.js",
  "core/styler/resize.js",
  "core/styler/font/color.js",
  "core/styler/font/bold.js",
  "core/styler/font/italic.js",
  "core/styler/font/underline.js",
  "core/styler/font/font.js",
  "core/styler/font/size.js",
  /** Helpers */
  "core/functions.js",
  "core/edit.js",
  "core/file.js",
  "core/clipboard.js",
  /** Connector */
  "core/connector/main.js",
  "core/connector/live.js",
  "core/connector/action.js",
  /** Interpreter */
  "core/interpreter/main.js",
  "core/interpreter/stack.js",
  "core/interpreter/lexer.js",
  "core/interpreter/parser/main.js",
  "core/interpreter/parser/expression.js",
  "core/interpreter/parser/arguments.js",
  "core/interpreter/evaluator/main.js",
  "core/interpreter/evaluator/expression.js",
  "core/interpreter/evaluator/function.js",
  "core/interpreter/evaluator/statement.js",
  "core/interpreter/type.js",
  /** Javascript interpreter */
  "api/spreadsheet.js",
  "api/interpreter.js",
  "api/main.js"
];

Import.after = function() {
  ENGEL.init();
  NOVAE_Interpreter(function() {
    document.querySelector("#loader").style.display = "none";
    NOVAE.$.init();
    NOVAE_UI.init();
    NOVAE.Speedy.runTest(function () {
      /** Add fade out animation, hide element */
      document.querySelector("#copyright_loading").classList.add("fadeOut");
      document.querySelector("#loader").classList.add("fadeOut");
      setTimeout( function() {
        document.querySelector("#loader").style.display = "none";
        document.querySelector("#copyright_loading").style.display = "none";
      }, 750);
    });
  });
};

Import.each = function(percent) {
  /** Update percentage in document */
  document.querySelector(".loader-title").innerHTML = percent + "%";
  if (percent >= 99) document.querySelector(".loader-wrapper").classList.add("fadeOut");
};

Import.me();