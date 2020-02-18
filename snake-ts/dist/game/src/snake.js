"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var cell_states_1 = require("../../boards/src/cell-states");
var NORTH = 0;
var EAST = 1;
var SOUTH = 2;
var WEST = 3;
var SnakePlayer = /** @class */ (function () {
    function SnakePlayer(ctx, board) {
        this.ctx = ctx;
        this.board = board;
        this.state = {
            alive: true,
            direction: WEST,
            speed: 6,
            lastTick: 0,
            tailLength: 3,
            head: { x: 35, y: 15 },
            tail: [],
        };
        this.controls = this.controls.bind(this);
    }
    SnakePlayer.prototype.controls = function (key) {
        console.log(key);
        /**
                0
              3   1
                2
        */
        // switch (key.key) {
        //     case 'ArrowRight': snake.direction = (snake.direction + 1) % 4; break;
        //     case 'ArrowLeft': snake.direction = snake.direction - 1 < 0 ? 3 : snake.direction - 1; break;
        // }
        switch (key.key) {
            case 'ArrowRight':
                this.state.direction = EAST;
                break;
            case 'ArrowUp':
                this.state.direction = NORTH;
                break;
            case 'ArrowLeft':
                this.state.direction = WEST;
                break;
            case 'ArrowDown':
                this.state.direction = SOUTH;
                break;
            case '=':
                this.state.speed += 1;
                break;
            case '-':
                this.state.speed -= 1;
                break;
            default: console.log(key.key);
        }
    };
    SnakePlayer.prototype.draw = function (time) {
        var _this = this;
        var c = this.ctx;
        c.clearRect(0, 0, this.board.cellPx * this.board.W, this.board.cellPx * this.board.H);
        c.fillStyle = 'red';
        c.fillRect(this.state.head.x * this.board.cellPx, this.state.head.y * this.board.cellPx, this.board.cellPx, this.board.cellPx);
        c.fillStyle = 'black';
        this.state.tail.forEach(function (tailPart) {
            c.fillRect(1 + tailPart.x * _this.board.cellPx, 1 + tailPart.y * _this.board.cellPx, _this.board.cellPx - 2, _this.board.cellPx - 2);
        });
    };
    SnakePlayer.prototype.move = function (time, update) {
        var _this = this;
        if (time) {
            var delta = time - this.state.lastTick;
            if (delta < 1 / this.state.speed * 1000) {
                return this.state.alive;
            }
            this.state.lastTick = time;
        }
        var nextHead = __assign({}, this.state.head);
        switch (this.state.direction) {
            case NORTH: {
                var nextY_1 = nextHead.y - 1;
                if (nextY_1 < 0) {
                    nextHead.y = this.board.H - 1;
                }
                else {
                    nextHead.y = nextY_1;
                    break;
                }
                break;
            }
            case EAST: {
                var nextX_1 = nextHead.x + 1;
                if (nextX_1 >= this.board.W) {
                    nextHead.x = 0;
                }
                else {
                    nextHead.x = nextX_1;
                }
                break;
            }
            case SOUTH: {
                var nextY_2 = nextHead.y + 1;
                if (nextY_2 >= this.board.H) {
                    nextHead.y = 0;
                }
                else {
                    nextHead.y = nextY_2;
                }
                break;
            }
            case WEST: {
                var nextX_2 = nextHead.x - 1;
                if (nextX_2 < 0) {
                    nextHead.x = this.board.W - 1;
                }
                else {
                    nextHead.x = nextX_2;
                }
                break;
            }
        }
        ;
        this.state.tail.forEach(function (tailPart) {
            var x = tailPart.x, y = tailPart.y;
            _this.board.setAtXY(x, y, cell_states_1.CellState.BLANK);
        });
        var nextTail = __spreadArrays(this.state.tail);
        // nextTail.unshift({ ...this.state.head });
        nextTail.unshift(__assign({}, this.state.head));
        nextTail = nextTail.slice(0, this.state.tailLength);
        nextTail.forEach(function (tailPart) {
            var x = tailPart.x, y = tailPart.y;
            _this.board.setAtXY(x, y, cell_states_1.CellState.TAIL);
        });
        var nextX = nextHead.x, nextY = nextHead.y;
        var nextCellState = this.board.getAtXY(nextX, nextY);
        switch (nextCellState) {
            case cell_states_1.CellState.FOOD: {
                // this.board.addFood();
                this.state.tailLength += 3;
                break;
            }
            case cell_states_1.CellState.BLANK: break;
            default: {
                this.state.alive = false;
                break;
            }
        }
        this.state.head = __assign({}, nextHead);
        this.state.tail = __spreadArrays(nextTail);
        this.board.setAtXY(nextHead.x, nextHead.y, cell_states_1.CellState.HEAD);
        update(nextCellState, nextHead.x, nextHead.y);
        return this.state.alive;
    };
    return SnakePlayer;
}());
exports.SnakePlayer = SnakePlayer;
;
