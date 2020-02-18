"use strict";
/**
 * utilities
 */
Object.defineProperty(exports, "__esModule", { value: true });
var debugEl = document.getElementById('debug');
exports.debug = function (txt) {
    if (debugEl) {
        var t = Array.isArray(txt) ? txt.join("\n") : txt;
        debugEl.innerHTML = "<pre>" + t + "</pre>";
    }
    else {
        console.log(txt);
    }
};
var gameStatus = document.getElementById('game-status');
var gameScrore = document.getElementById('score');
exports.updateScore = function (score) {
    if (gameScrore) {
        gameScrore.innerText = "" + score;
    }
};
exports.getContext2d = function (canvasId, width, height) {
    var canvasEl = document.getElementById(canvasId);
    if (canvasEl) {
        canvasEl.width = width;
        canvasEl.height = height;
        var context = canvasEl.getContext('2d');
        return context;
    }
    else {
        document.body.innerHTML = "<div> Add a <canvas id=\"" + "canvasId" + "\"/> element to this html </div>";
    }
    return null;
};
exports.random = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
