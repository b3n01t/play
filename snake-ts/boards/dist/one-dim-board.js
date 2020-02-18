define(["require", "exports", "./cell-states"], function (require, exports, cell_states_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * OneDimBoard
     *  Cells in a 1 dimension array
     */
    class OneDimBoard {
        constructor(W, H, cellPx, cells, bgColor = 'white') {
            this.W = W;
            this.H = H;
            this.cellPx = cellPx;
            this.cells = cells;
            this.bgColor = bgColor;
            if (cells.length !== W * H) {
                throw new Error(`Invalid Board setup: ${cells.length} !== ${W} * ${H} `);
            }
        }
        // Concert the index in the cells arry to x y coordinates in the board space
        cellIdToXY(id) {
            const x = id % this.W;
            const y = (id - x) / this.W;
            return { x, y };
        }
        // Concert x y coordinates in the board space to the index in the cells array
        XYToCellId(x, y) {
            return y * this.W + x;
        }
        // Given x y coordinates from pixel space, return the cell's coordinate in the pixel space
        //      usefull for mouse interactions
        //      e.g.: cellW = 15px , x = 20px => 15px
        XYPxToCellXYPx(xPx, yPx) {
            const x = xPx - (xPx % this.cellPx);
            const y = yPx - (yPx % this.cellPx);
            return { x, y };
        }
        // Convert x y coordinates from pixel space to the Board space
        XYPxToXYBoard(xPx, yPx) {
            const { x, y } = this.XYPxToCellXYPx(xPx, yPx);
            return {
                x: x / this.cellPx,
                y: y / this.cellPx,
            };
        }
        getAtId(id) {
            return this.cells[id];
        }
        getAtXY(x, y) {
            return this.cells[this.XYToCellId(x, y)];
        }
        setAtId(id, val) {
            this.cells[id] = val;
        }
        setAtXY(x, y, val) {
            this.cells[this.XYToCellId(x, y)] = val;
        }
        isCellEmptyAtId(id) {
            return this.getAtId(id) === cell_states_1.CellState.BLANK;
        }
        isCellEmptyAtXY(x, y) {
            return this.getAtXY(x, y) === cell_states_1.CellState.BLANK;
        }
        cellCount() {
            return this.cells.length;
        }
        serialize() {
            return JSON.stringify({
                W: this.W,
                H: this.H,
                cells: this.cells.join(''),
            });
        }
    }
    exports.OneDimBoard = OneDimBoard;
    class SnakeBoard extends OneDimBoard {
        constructor(W, H, cellPx, cells, bgColor = 'white') {
            super(W, H, cellPx, cells, bgColor);
            this.W = W;
            this.H = H;
            this.cellPx = cellPx;
            this.cells = cells;
            this.bgColor = bgColor;
            this.c = null;
        }
        drawStateAt(x, y, state) {
            const cellW = this.cellPx;
            const cellH = this.cellPx;
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
        }
        draw(c) {
            if (this.c === null) {
                this.c = c;
            }
            this.cells.forEach((cellState, cellId) => {
                const { x, y } = this.cellIdToXY(cellId);
                this.drawStateAt(x, y, cellState);
            });
        }
        refresh() {
            if (this.c) {
                this.draw(this.c);
            }
            else {
                console.error('Cannot Refresh, Don\'t have a canvas');
            }
        }
    }
    exports.SnakeBoard = SnakeBoard;
});
//# sourceMappingURL=one-dim-board.js.map