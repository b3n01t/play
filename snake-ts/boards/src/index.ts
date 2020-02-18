import { CellState, CellStates } from './cell-states';

/**
 * Board collection
 */

//--

export { OneDimBoard } from './one-dim-board';

//-- Board implemetations
import { BlankBoard } from './boards/blank';
import { WallsAroundBoard } from './boards/walls-around';
import { WallsWithWalls } from './boards/walls-with-holes';
import { WallsWithWalls2 } from './boards/walls-with-holes-2';
import { WallsWithWalls3 } from './boards/walls-with-holes-3';
import { Wolf } from './boards/wolf';
import { Wolf2 } from './boards/wolf2';
import { Tree } from './boards/tree';

import { GameBoards } from './registry';
import { SnakeBoard } from './one-dim-board';

GameBoards.add('blank', BlankBoard);
GameBoards.add('wall-around', WallsAroundBoard);
GameBoards.add('wall-holes', WallsWithWalls);
GameBoards.add('wall-holes2', WallsWithWalls2);
GameBoards.add('wall-holes3', WallsWithWalls3);
GameBoards.add('wolf', Wolf);
GameBoards.add('wolf2', Wolf2);
GameBoards.add('tree', Tree);

export { GameBoards };

export const newBlank = () => {
    const Width = 50;
    const Height = 30;
    const cellPx = 15;
    const l = Width * Height;
    const Cells = new Array(l);
    Cells.fill(CellStates.BLANK, 0, l);
    const BlankBoard = new SnakeBoard(Width, Height, cellPx, Cells);
    return BlankBoard;
}