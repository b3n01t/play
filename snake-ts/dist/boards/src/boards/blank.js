"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Blank 50x30 board
 */
var one_dim_board_1 = require("../one-dim-board");
var cell_states_1 = require("../cell-states");
//--
var Width = 50;
var Height = 30;
var cellPx = 15;
var l = Width * Height;
var Cells = new Array(l);
Cells.fill(cell_states_1.CellState.BLANK, 0, l);
console.log(Cells);
//--
exports.BlankBoard = new one_dim_board_1.SnakeBoard(Width, Height, cellPx, Cells);
