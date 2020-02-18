"use strict";
/**
 *
 */
// import { debug, getContext2d, random, updateScore } from './utils';
Object.defineProperty(exports, "__esModule", { value: true });
//---
var utils_1 = require("../../lib/utils");
var index_1 = require("../../boards/src/index");
var cell_states_1 = require("../../boards/src/cell-states");
console.log(index_1.GameBoards.list());
var selectedBoard = 'wolf-2';
var PlayBoard = index_1.GameBoards.get(selectedBoard);
var worldW = PlayBoard.W;
var worldH = PlayBoard.H;
var cellPx = PlayBoard.cellPx;
var worldWpx = worldW * cellPx;
var worldHpx = worldH * cellPx;
var boardNameEl = document.getElementById('board-name');
if (boardNameEl) {
    boardNameEl.innerText = selectedBoard;
}
var canvasEl = document.getElementById('canvas-board');
var canvasElDraw = document.getElementById('canvas-board-draw');
var contextBoard = utils_1.getContext2d('canvas-board', worldWpx, worldHpx);
var contextBoardDraw = utils_1.getContext2d('canvas-board-draw', worldWpx, worldHpx);
if (canvasEl && canvasElDraw && contextBoard && contextBoardDraw) {
    PlayBoard.draw(contextBoard);
    var rect_1 = canvasEl.getBoundingClientRect();
    var cellX_1 = 0;
    var cellY_1 = 0;
    canvasElDraw.onmousemove = function (e) {
        var xPx = e.clientX - rect_1.left;
        var yPx = e.clientY - rect_1.top;
        var _a = PlayBoard.XYPxToCellXYPx(xPx, yPx), cx = _a.x, cy = _a.y;
        var boardCell = PlayBoard.XYPxToXYBoard(xPx, yPx);
        cellX_1 = boardCell.x;
        cellY_1 = boardCell.y;
        requestAnimationFrame(function () {
            contextBoardDraw.clearRect(0, 0, worldWpx, worldHpx);
            contextBoardDraw.fillStyle = 'red';
            contextBoardDraw.fillRect(cx, cy, PlayBoard.cellPx, PlayBoard.cellPx);
            contextBoardDraw.stroke();
        });
    };
    document.addEventListener('keypress', function (key) {
        switch (key.key) {
            case ' ':
                PlayBoard.setAtXY(cellX_1, cellY_1, cell_states_1.CellState.WALL);
                PlayBoard.draw(contextBoard);
                break;
            case 'c':
                PlayBoard.setAtXY(cellX_1, cellY_1, cell_states_1.CellState.BLANK);
                PlayBoard.draw(contextBoard);
                break;
            default:
                break;
        }
    });
}
