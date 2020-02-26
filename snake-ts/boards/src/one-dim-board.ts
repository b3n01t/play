/**
 * Board definition
 */
import { random } from '../../lib/utils';
import { CellStates, CellState } from './cell-states';

export interface Board {
    H: number;
    W: number;
    bgColor: string;
    cellPx: number;
    cellIdToXY(id: number): { x: number, y: number };
    XYToCellId(x: number, y: number): number;
    XYPxToCellXYPx(xPx: number, yPx: number): { x: number, y: number };
    XYPxToXYBoard(xPx: number, yPx: number): { x: number, y: number };
    getAtId(id: number): CellState;
    getAtXY(x: number, y: number): CellState;
    setAtId(id: number, val: CellState): void;
    setAtXY(x: number, y: number, val: CellState): void;
    isCellEmptyAtId(id: number): boolean;
    isCellEmptyAtXY(x: number, y: number): boolean;
    cellCount(): number;
    init(c: CanvasRenderingContext2D, ...args: any[]): void;
    draw(time?: number): void;
    refresh(): void;
    serialize(name?: string): string;
}

/**
 * OneDimBoard
 *  Cells in a 1 dimension array
 */
export abstract class OneDimBoard implements Board {
    protected originalCell: Array<CellState> = [];
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
        this.originalCell = [...cells];
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

    public setAtId(id: number, val: CellStates) {
        this.cells[id] = val;
    }

    public setAtXY(x: number, y: number, val: CellStates) {
        this.cells[this.XYToCellId(x, y)] = val;
    }

    public isCellEmptyAtId(id: number) {
        return this.getAtId(id) === CellStates.BLANK;
    }

    public isCellEmptyAtXY(x: number, y: number) {
        return this.getAtXY(x, y) === CellStates.BLANK;
    }

    public cellCount() {
        return this.cells.length;
    }

    public serialize(name?: string) {
        return JSON.stringify({
            name,
            W: this.W,
            H: this.H,
            cells: this.cells.join(''),
        });
    }

    public abstract init(c: CanvasRenderingContext2D, ...args: any[]): void;
    public abstract draw(time?: number): void;
    public abstract refresh(): void;
}

type JsonSerialBoard = {
    name: string;
    W: number;
    H: number;
    cells: string;
};

// https://stackoverflow.com/questions/39614311/class-constructor-type-in-typescript
// type BoardConstructor = new <T>(W: number, H: number, cellPx: number, cells: Array<CellState>, bgColor: string) => T;
export const LoadBoard = <T extends OneDimBoard>(serial: string, BoardClass: new (...args: any[]) => T): T => {
    const jsonBoard: JsonSerialBoard = JSON.parse(serial);
    const { W, H, cells } = jsonBoard;
    const cellPx = 15;
    const cellArray = cells.split('');
    const bgColor = 'white';

    const boardInstance = new BoardClass(W, H, cellPx, cellArray, bgColor);
    console.log(boardInstance);
    return boardInstance;
}

//--
export class SnakeBoard extends OneDimBoard {
    public c: CanvasRenderingContext2D | null = null;
    constructor(
        public W: number,
        public H: number,
        public cellPx: number,
        public cells: Array<CellState>,
        public bgColor = 'white'
    ) { super(W, H, cellPx, cells, bgColor) }

    init(c: CanvasRenderingContext2D, foodCount?: number) {
        if (this.c === null) {
            this.c = c;
        }
        this.cells = [...this.originalCell];
        let hasFood = false;
        for (let i = 0; i < this.cells.length; i++) {
            const state = this.cells[i];
            // Make sure there is some food;
            if (state === CellStates.FOOD) {
                hasFood = true;
                break;
            }
            // Remove dead snake parts
            if (state === CellStates.HEAD || state === CellStates.TAIL) {
                this.setAtId(i, CellStates.BLANK);
            }
        }
        if (!hasFood && foodCount) {
            for (let i = 0; i < foodCount; i++) {
                let cid = random(0, this.cellCount());
                while (!this.isCellEmptyAtId(cid)) {
                    cid = random(0, this.cellCount());
                }
                this.setAtId(cid, CellStates.FOOD);
            }
        }
    }
    drawStateAt(x: number, y: number, state: CellState) {
        const cellW = this.cellPx;
        const cellH = this.cellPx;
        if (this.c) {
            switch (state) {
                case CellStates.FOOD:
                    // food needs to be an object
                    this.c.shadowBlur = 0;
                    this.c.shadowColor = this.c.fillStyle = this.bgColor;
                    this.c.fillRect(x * cellW, y * cellH, cellW, cellH);
                    this.c.shadowColor = this.c.fillStyle = 'rgb(115, 201, 145)';
                    this.c.beginPath();
                    this.c.arc(x * cellW + (cellW / 2), y * cellH + (cellH / 2), cellW / 2, 0, 2 * Math.PI);
                    this.c.fill();
                    break;
                case CellStates.WALL:
                    this.c.shadowBlur = 1;
                    this.c.shadowColor = this.c.fillStyle = 'rgb(51, 51, 51)';
                    this.c.fillRect(x * cellW, y * cellH, cellW, cellH);
                    break;
                case CellStates.BLANK:
                    this.c.shadowBlur = 0;
                    this.c.shadowColor = this.c.fillStyle = this.bgColor;
                    this.c.fillRect(x * cellW, y * cellH, cellW, cellH);
                    break;
                default:
                    this.c.shadowBlur = 0;
                    // this.c.shadowColor = this.c.fillStyle = 'blue';
                    this.c.shadowColor = this.c.fillStyle = this.bgColor;
                    this.c.fillRect(x * cellW, y * cellH, cellW, cellH);
                    break;
            }
        } else {
            throw new Error('No Context!');
        }
    }

    draw(time?: number) {
        this.cells.forEach((cellState, cellId) => {
            const { x, y } = this.cellIdToXY(cellId);
            this.drawStateAt(x, y, cellState);
        });
    }

    refresh() {
        if (this.c) {
            this.draw()
        } else {
            console.error('Cannot Refresh, Don\'t have a canvas');
        }
    }
}