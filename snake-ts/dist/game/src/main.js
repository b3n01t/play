"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 */
var utils_1 = require("../../lib/utils");
exports.run = function (ctxSnake, ctxBoard, board, debug) {
    if (debug === void 0) { debug = function () { }; }
    var targetFPS = 60;
    var frameDuration = 1 / targetFPS * 1000;
    var lastFrameTime = 0;
    var frame = 0;
    var fpsHist = [];
    var running = true;
    var reqAnimationID = 0;
    var snake = new snake_1.SnakePlayer(ctxSnake, board);
    document.addEventListener('keydown', snake.controls);
    document.addEventListener('keypress', function (key) {
        if (key.key === ' ') {
            if (running) {
                cancelAnimationFrame(reqAnimationID);
            }
            else {
                reqAnimationID = requestAnimationFrame(loop1);
            }
            running = !running;
        }
    });
    board.draw(ctxBoard);
    var loop1 = function (time) {
        var diff = time - lastFrameTime;
        if (diff <= frameDuration) {
            return requestAnimationFrame(loop1);
        }
        frame++;
        //--
        var isAlive = snake.move(time, function (nextCell, nextX, nextY) {
            switch (nextCell) {
                case cell_states_1.CellState.FOOD:
                    var cid = utils_1.random(0, board.cellCount());
                    while (!board.isCellEmptyAtId(cid)) {
                        cid = utils_1.random(0, board.cellCount());
                    }
                    board.setAtId(cid, cell_states_1.CellState.FOOD);
                    board.setAtXY(nextX, nextY, cell_states_1.CellState.BLANK);
                    board.refresh();
                    utils_1.updateScore(snake.state.tailLength);
                default: break;
            }
        });
        snake.draw(time);
        // -- :/
        // board.draw(ctxBoard);
        if (!isAlive) {
            return;
        }
        //--
        fpsHist.unshift(1 / (diff / 1000));
        debug([
            "fps: " + fpsHist.slice(0, 10).join('\n'),
            "min FPS: " + Math.min.apply(Math, fpsHist.slice(0, 100)),
            "max FPS: " + Math.max.apply(Math, fpsHist.slice(0, 100)),
            'loop1',
            "" + frame,
            "" + diff,
            "" + 1 / snake.state.speed * 1000,
        ]);
        lastFrameTime = time;
        reqAnimationID = requestAnimationFrame(loop1);
    };
    requestAnimationFrame(loop1);
};
//---
var index_1 = require("../../boards/src/index");
// import {
//     Board,
//     BlankBoard,
//     WallsAroundBoard,
//     WallsWithWalls,
//     WallsWithWalls2,
//     WallsWithWalls3,
//     Wolf,
//     Wolf2,
//     Tree
// } from '../../boards/dist/main';
var snake_1 = require("./snake");
var cell_states_1 = require("../../boards/src/cell-states");
var board_select_1 = require("./board-select");
//--
var select = board_select_1.createBoardSelect();
var selectC = document.getElementById('board-select');
(_a = selectC) === null || _a === void 0 ? void 0 : _a.appendChild(select);
//--
// const PlayBoard = BlankBoard;
// const PlayBoard = WallsAroundBoard;
// const PlayBoard = WallsWithWalls3;
var PlayBoard = index_1.Tree;
var worldW = PlayBoard.W;
var worldH = PlayBoard.H;
var cellPx = PlayBoard.cellPx;
var worldWpx = worldW * cellPx;
var worldHpx = worldH * cellPx;
var contextSnake = utils_1.getContext2d('canvas-snake', worldWpx, worldHpx);
var contextBoard = utils_1.getContext2d('canvas-board', worldWpx, worldHpx);
if (contextSnake && contextBoard) {
    exports.run(contextSnake, contextBoard, PlayBoard, utils_1.debug);
}
else {
    console.error('Could not get a CanvasRenderingContext2D');
}
