"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var one_dim_board_1 = require("../one-dim-board");
var Width = 50;
var Height = 30;
var cellPx = 15;
var BoardTxt = "\n             9       99 9   9   9    9     9      \n        9    99   99 9  99  99 99    9    99      \n         9    9    9999  9   999    9    99       \n         99   99    99   99  9    99     9        \n          99   999 99     9  9   99    999        \n           9     999    9  999  99    9999        \n           9  999999   99  99   999   9  9        \n         9999999   99 99  99   99 99999  99       \n        99        99999   9   999   9     9       \n       99        99  99   9  99 9   99   99       \n                99    99 99 99  99       9        \n            99999      999999    9       99       \n             99        999999   9         9       \n             9         999999   99       99       \n             99        999999    9       9        \n             99        999999   99       9        \n              9        999999   9        99       \n             99        999999   99        9       \n             9         999999    9        9       \n             9         999999   99        9       \n             9         999999   9        99       \n             99        999999   99       9        \n             9        99999999   9       9        \n             9       9999999999          9        \n             99      9999999999          99       \n              9     999999999999          9       \n             99    99999999999999        99       \n             9     99999999999999        9        \n             9    9999999999999999       99       \n             9    9999999999999999        9       \n";
var Cells = BoardTxt.replace(/\n/g, '').replace(/ /g, '0').split('').map(function (c) {
    var int = parseInt(c, 10);
    return int;
});
exports.Tree = new one_dim_board_1.SnakeBoard(Width, Height, cellPx, Cells);
