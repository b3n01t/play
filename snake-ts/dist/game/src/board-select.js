"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBoardSelect = function () {
    var selectWrap = document.createElement("div");
    var options = Object.keys(localStorage);
    console.log(options);
    var select = "<select name='boar-select' id='boar-select' >\n" + options.map(function (opt) {
        return "<option value='" + opt + "'>" + opt + "</option>";
    }) + "\n</select>";
    selectWrap.innerHTML = select;
    return selectWrap;
};
