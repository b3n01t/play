import { Board } from "./index";
import { CellState } from './cell-states';
/**
 * OneDimBoard
 *  Cells in a 1 dimension array
 */

export abstract class OneDimBoard implements Board {
    constructor(
        public W: number,
        public H: number,
        public cellPx: number,
        public cells: Array<CellState>,
        public bgColor = 'white'
    ) {
        if (cells.length !== W * H) {
            throw new Error(`Invalid Board setup: ${cells.length} !== ${W} * ${H} `);
        }
    }

    // Concert the index in the cells arry to x y coordinates in the board space
    public cellIdToXY(id: number) {
        const x = id % this.W;
        const y = (id - x) / this.W;
        return { x, y };
    }

    // Concert x y coordinates in the board space to the index in the cells array
    public XYToCellId(x: number, y: number) {
        return y * this.W + x;
    }

    // Given x y coordinates from pixel space, return the cell's coordinate in the pixel space
    //      usefull for mouse interactions
    //      e.g.: cellW = 15px , x = 20px => 15px
    public XYPxToCellXYPx(xPx: number, yPx: number) {
        const x = xPx - (xPx % this.cellPx);
        const y = yPx - (yPx % this.cellPx);
        return { x, y };
    }

    // Convert x y coordinates from pixel space to the Board space
    public XYPxToXYBoard(xPx: number, yPx: number) {
        const { x, y } = this.XYPxToCellXYPx(xPx, yPx);
        return {
            x: x / this.cellPx,
            y: y / this.cellPx,
        }
    }

    public getAtId(id: number) {
        return this.cells[id];
    }

    public getAtXY(x: number, y: number) {
        return this.cells[this.XYToCellId(x, y)];
    }

    public setAtId(id: number, val: CellState) {
        this.cells[id] = val;
    }

    public setAtXY(x: number, y: number, val: CellState) {
        this.cells[this.XYToCellId(x, y)] = val;
    }

    public isCellEmptyAtId(id: number) {
        return this.getAtId(id) === CellState.BLANK;
    }

    public isCellEmptyAtXY(x: number, y: number) {
        return this.getAtXY(x, y) === CellState.BLANK;
    }

    public cellCount() {
        return this.cells.length;
    }
    public abstract draw(c: CanvasRenderingContext2D): void;
    public abstract refresh(): void;
}

export class SnakeBoard extends OneDimBoard {
    public c: CanvasRenderingContext2D | null = null;
    constructor(
        public W: number,
        public H: number,
        public cellPx: number,
        public cells: Array<CellState>,
        public bgColor = 'white'
    ) { super(W, H, cellPx, cells, bgColor) }

    drawStateAt(x: number, y: number, state: CellState) {
        const cellW = this.cellPx;
        const cellH = this.cellPx;

        if (this.c) {
            this.c.lineWidth = 3;
            switch (state) {
                case CellState.FOOD:
                    // food needs to be an object
                    this.c.fillStyle = 'rgb(115, 201, 145)';
                    this.c.beginPath();
                    this.c.arc(x * cellW + (cellW / 2), y * cellH + (cellH / 2), cellW / 2, 0, 2 * Math.PI);
                    this.c.fill();
                    // this.c.fillRect(1 + x * cellW, 1 + y * cellH, cellW - 2, cellH - 2);
                    break;
                case CellState.WALL:
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

    draw(c: CanvasRenderingContext2D) {
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
            // this.c.clearRect(0, 0, this.W * this.cellPx, this.H * this.cellPx)
            this.draw(this.c)
        } else {
            console.error('Cannot Refresh, Don\'t have a canvas');
        }
    }
}