import { Board } from "./index";
import { CellState } from './cell-states';
/**
 * OneDimBoard
 *  Cells in a 1 dimension array
 */
export declare abstract class OneDimBoard implements Board {
    W: number;
    H: number;
    cellPx: number;
    cells: Array<CellState>;
    bgColor: string;
    constructor(W: number, H: number, cellPx: number, cells: Array<CellState>, bgColor?: string);
    cellIdToXY(id: number): {
        x: number;
        y: number;
    };
    XYToCellId(x: number, y: number): number;
    XYPxToCellXYPx(xPx: number, yPx: number): {
        x: number;
        y: number;
    };
    XYPxToXYBoard(xPx: number, yPx: number): {
        x: number;
        y: number;
    };
    getAtId(id: number): CellState;
    getAtXY(x: number, y: number): CellState;
    setAtId(id: number, val: CellState): void;
    setAtXY(x: number, y: number, val: CellState): void;
    isCellEmptyAtId(id: number): boolean;
    isCellEmptyAtXY(x: number, y: number): boolean;
    cellCount(): number;
    serialize(): string;
    abstract draw(c: CanvasRenderingContext2D): void;
    abstract refresh(): void;
}
export declare class SnakeBoard extends OneDimBoard {
    W: number;
    H: number;
    cellPx: number;
    cells: Array<CellState>;
    bgColor: string;
    c: CanvasRenderingContext2D | null;
    constructor(W: number, H: number, cellPx: number, cells: Array<CellState>, bgColor?: string);
    drawStateAt(x: number, y: number, state: CellState): void;
    draw(c: CanvasRenderingContext2D): void;
    refresh(): void;
}
//# sourceMappingURL=one-dim-board.d.ts.map