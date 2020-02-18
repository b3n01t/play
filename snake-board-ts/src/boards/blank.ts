/**
 * Blank 50x30 board
 */
import { SnakeBoard } from "./one-dim-board";
import { CellState } from './cell-states';
import { GameBoards } from "./index";
//--
const Width = 50;
const Height = 30;
const cellPx = 15;
const l = Width * Height;
const Cells = new Array(l);
Cells.fill(CellState.BLANK, 0, l);
console.log(Cells);
//--

export const BlankBoard = new SnakeBoard(Width, Height, cellPx, Cells);
