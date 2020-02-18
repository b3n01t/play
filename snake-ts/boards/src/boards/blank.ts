/**
 * Blank 50x30 board
 */
import { SnakeBoard } from "../one-dim-board";
import { CellStates } from '../cell-states';
//--
const Width = 50;
const Height = 30;
const cellPx = 15;
const l = Width * Height;
const Cells = new Array(l);
Cells.fill(CellStates.BLANK, 0, l);
//--
export const BlankBoard = new SnakeBoard(Width, Height, cellPx, Cells);
