/**
 * Blank 5 x3  board
 */
import { SnakeBoard } from '../one-dim-board';
import { CellState } from '../cell-states';
//--
const Width = 50;
const Height = 30;
const cellPx = 15;

const Cells: Array<CellState> = `
99999999999999999999999   999999999999999999999999
9                                                9
9                                                9
9                                                9
9                                                9
9        3                                       9
9                                                9
9                                                9
9                                                9
9                                                9
9                                                9
9                                                9
9                                                9
9                                                9
                       999                        
                       999                        
                       999                        
9                                                9
9                                                9
9                                                9
9                                                9
9                                                9
9                                                9
9                                                9
9                                                9
9                                                9
9                                                9
9                                                9
9                                                9
99999999999999999999999   999999999999999999999999
`.replace(/\n/g,'').replace(/ /g,'0').split('');
//--

export const WallsWithWalls = new SnakeBoard(Width, Height, cellPx, Cells);
