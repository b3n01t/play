"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var one_dim_board_1 = require("../one-dim-board");
//--
var Width = 50;
var Height = 30;
var cellPx = 15;
var l = Width * Height;
var BoardTxt = "\n                                                  \n                                                  \n                                                  \n                                                  \n                  3                               \n                                                  \n                                                  \n                                                  \n                                                  \n                                                  \n                                  3               \n                                                  \n                                                  \n                                                  \n9999999999999999999999                            \n999999 999 9999999999                             \n              9                                   \n99            9 9                   3             \n999           9999                                \n 9999         99 99                               \n  9999       99 9 9                               \n    9999999999    99999                           \n     999999999    9 9 9                           \n    99999999999  9 9 99                           \n    999999999999999999                            \n   9999999999999                                  \n   999999999999                                   \n   9 999999 99                                    \n   9 9 9 99 9                                     \n999999999999999999999999999                       \n";
var Cells = BoardTxt.replace(/\n/g, '').replace(/ /g, '0').split('').map(function (c) {
    var int = parseInt(c, 10);
    return int;
});
exports.Wolf2 = new one_dim_board_1.SnakeBoard(Width, Height, cellPx, Cells);
