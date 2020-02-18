"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var cell_states_1 = require("./cell-states");
/**
 * OneDimBoard
 *  Cells in a 1 dimension array
 */
var OneDimBoard = /** @class */ (function () {
    function OneDimBoard(W, H, cellPx, cells, bgColor) {
        if (bgColor === void 0) { bgColor = 'white'; }
        this.W = W;
        this.H = H;
        this.cellPx = cellPx;
        this.cells = cells;
        this.bgColor = bgColor;
        if (cells.length !== W * H) {
            throw new Error("Invalid Board setup: " + cells.length + " !== " + W + " * " + H + " ");
        }
    }
    // Concert the index in the cells arry to x y coordinates in the board space
    OneDimBoard.prototype.cellIdToXY = function (id) {
        var x = id % this.W;
        var y = (id - x) / this.W;
        return { x: x, y: y };
    };
    // Concert x y coordinates in the board space to the index in the cells array
    OneDimBoard.prototype.XYToCellId = function (x, y) {
        return y * this.W + x;
    };
    // Given x y coordinates from pixel space, return the cell's coordinate in the pixel space
    //      usefull for mouse interactions
    //      e.g.: cellW = 15px , x = 20px => 15px
    OneDimBoard.prototype.XYPxToCellXYPx = function (xPx, yPx) {
        var x = xPx - (xPx % this.cellPx);
        var y = yPx - (yPx % this.cellPx);
        return { x: x, y: y };
    };
    // Convert x y coordinates from pixel space to the Board space
    OneDimBoard.prototype.XYPxToXYBoard = function (xPx, yPx) {
        var _a = this.XYPxToCellXYPx(xPx, yPx), x = _a.x, y = _a.y;
        return {
            x: x / this.cellPx,
            y: y / this.cellPx,
        };
    };
    OneDimBoard.prototype.getAtId = function (id) {
        return this.cells[id];
    };
    OneDimBoard.prototype.getAtXY = function (x, y) {
        return this.cells[this.XYToCellId(x, y)];
    };
    OneDimBoard.prototype.setAtId = function (id, val) {
        this.cells[id] = val;
    };
    OneDimBoard.prototype.setAtXY = function (x, y, val) {
        this.cells[this.XYToCellId(x, y)] = val;
    };
    OneDimBoard.prototype.isCellEmptyAtId = function (id) {
        return this.getAtId(id) === cell_states_1.CellState.BLANK;
    };
    OneDimBoard.prototype.isCellEmptyAtXY = function (x, y) {
        return this.getAtXY(x, y) === cell_states_1.CellState.BLANK;
    };
    OneDimBoard.prototype.cellCount = function () {
        return this.cells.length;
    };
    OneDimBoard.prototype.serialize = function () {
        return JSON.stringify({
            W: this.W,
            H: this.H,
            cells: this.cells.join(''),
        });
    };
    return OneDimBoard;
}());
exports.OneDimBoard = OneDimBoard;
var SnakeBoard = /** @class */ (function (_super) {
    __extends(SnakeBoard, _super);
    function SnakeBoard(W, H, cellPx, cells, bgColor) {
        if (bgColor === void 0) { bgColor = 'white'; }
        var _this = _super.call(this, W, H, cellPx, cells, bgColor) || this;
        _this.W = W;
        _this.H = H;
        _this.cellPx = cellPx;
        _this.cells = cells;
        _this.bgColor = bgColor;
        _this.c = null;
        return _this;
    }
    SnakeBoard.prototype.drawStateAt = function (x, y, state) {
        var cellW = this.cellPx;
        var cellH = this.cellPx;
        if (this.c) {
            switch (state) {
                case cell_states_1.CellState.FOOD:
                    // food needs to be an object
                    this.c.fillStyle = 'rgb(115, 201, 145)';
                    this.c.beginPath();
                    this.c.arc(x * cellW + (cellW / 2), y * cellH + (cellH / 2), cellW / 2, 0, 2 * Math.PI);
                    this.c.fill();
                    // this.c.fillRect(1 + x * cellW, 1 + y * cellH, cellW - 2, cellH - 2);
                    break;
                case cell_states_1.CellState.WALL:
                    // c.fillStyle = 'black';
                    this.c.fillStyle = 'rgb(51, 51, 51)';
                    this.c.fillRect(x * cellW, y * cellH, cellW, cellH);
                    break;
                default:
                    this.c.fillStyle = this.bgColor;
                    this.c.fillRect(x * cellW, y * cellH, cellW, cellH);
                    // c.fillStyle = 'rgba(0,0,0,0)';
                    break;
            }
        }
    };
    SnakeBoard.prototype.draw = function (c) {
        var _this = this;
        if (this.c === null) {
            this.c = c;
        }
        this.cells.forEach(function (cellState, cellId) {
            var _a = _this.cellIdToXY(cellId), x = _a.x, y = _a.y;
            _this.drawStateAt(x, y, cellState);
        });
    };
    SnakeBoard.prototype.refresh = function () {
        if (this.c) {
            this.draw(this.c);
        }
        else {
            console.error('Cannot Refresh, Don\'t have a canvas');
        }
    };
    return SnakeBoard;
}(OneDimBoard));
exports.SnakeBoard = SnakeBoard;
