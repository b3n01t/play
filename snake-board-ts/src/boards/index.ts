import { CellState } from './cell-states';

/**
 * Board collection
 */

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
    draw(c: CanvasRenderingContext2D): void;
    refresh(): void;
}


class BoardRegistry {
    private registry: {
        [name: string]: Board
    } = {};
    constructor() { }

    get(name: string) {
        return this.registry[name];
    }

    add(name: string, board: Board) {
        this.registry[name] = board;
        // localStorage.setItem(name,board);
    }

    list() {
        return Object.keys(this.registry);
    }

}

export { OneDimBoard } from './one-dim-board';
//-- Board implemetations

import { BlankBoard } from './blank';
import { WallsAroundBoard } from './walls-around';
import { WallsWithHoles } from './walls-with-holes';
import { WallsWithHoles2 } from './walls-with-holes-2';
import { WallsWithHoles3 } from './walls-with-holes-3';
import { Wolf } from './wolf';
import { Wolf2 } from './wolf2';

export const GameBoards = new BoardRegistry();


GameBoards.add('blank', BlankBoard);
GameBoards.add('walls-around', WallsAroundBoard);
GameBoards.add('walls-with-holes', WallsWithHoles);
GameBoards.add('walls-with-holes2', WallsWithHoles2);
GameBoards.add('walls-with-holes3', WallsWithHoles3);
GameBoards.add('wolf', Wolf);
GameBoards.add('wolf-2', Wolf2);

