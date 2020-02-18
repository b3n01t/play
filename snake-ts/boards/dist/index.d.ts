import { CellState } from './cell-states';
/**
 * Board collection
 */
export interface Board {
    H: number;
    W: number;
    bgColor: string;
    cellPx: number;
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
    draw(c: CanvasRenderingContext2D): void;
    refresh(): void;
    serialize(): string;
}
export { OneDimBoard } from './one-dim-board';
export { BlankBoard } from './boards/blank';
export { WallsAroundBoard } from './boards/walls-around';
export { WallsWithWalls } from './boards/walls-with-holes';
export { WallsWithWalls2 } from './boards/walls-with-holes-2';
export { WallsWithWalls3 } from './boards/walls-with-holes-3';
export { Wolf } from './boards/wolf';
export { Wolf2 } from './boards/wolf2';
export { Tree } from './boards/tree';
export { GameBoards } from './registry';
//# sourceMappingURL=index.d.ts.map