/**
 * 
 */
import { debug, getContext2d, random, updateScore } from './utils';

//---
import { GameBoards } from './boards/index';

import { CellState } from './boards/cell-states';

console.log(GameBoards.list());

// const selectedBoard = 'wolf-2';
const selectedBoard = 'blank';
const PlayBoard = GameBoards.get(selectedBoard);

const worldW = PlayBoard.W;
const worldH = PlayBoard.H;
const cellPx = PlayBoard.cellPx;

const worldWpx = worldW * cellPx;
const worldHpx = worldH * cellPx;

const boardNameEl = document.getElementById('board-name');
if(boardNameEl){
    boardNameEl.innerText = selectedBoard;
}

const canvasEl = document.getElementById('canvas-board');
const canvasElDraw = document.getElementById('canvas-board-draw');

const contextBoard = getContext2d('canvas-board', worldWpx, worldHpx);
const contextBoardDraw = getContext2d('canvas-board-draw', worldWpx, worldHpx);

if (canvasEl && canvasElDraw && contextBoard && contextBoardDraw) {
    PlayBoard.draw(contextBoard);
    const rect = canvasEl.getBoundingClientRect();
    let cellX = 0;
    let cellY = 0;
    canvasElDraw.onmousemove = (e) => {

        const xPx = e.clientX - rect.left;
        const yPx = e.clientY - rect.top;

        const { x: cx, y: cy } = PlayBoard.XYPxToCellXYPx(xPx, yPx);
        const boardCell = PlayBoard.XYPxToXYBoard(xPx, yPx);
        cellX = boardCell.x;
        cellY = boardCell.y;

        requestAnimationFrame(() => {
            contextBoardDraw.clearRect(0, 0, worldWpx, worldHpx);
            contextBoardDraw.fillStyle = 'red';

            contextBoardDraw.fillRect(cx, cy, PlayBoard.cellPx, PlayBoard.cellPx);
            contextBoardDraw.stroke();
        });
    }
    document.addEventListener('keypress', (key) => {
        switch (key.key) {
            case ' ':
                PlayBoard.setAtXY(cellX, cellY, CellState.WALL);
                PlayBoard.draw(contextBoard);
                break;
            case 'c':
                PlayBoard.setAtXY(cellX, cellY, CellState.BLANK);
                PlayBoard.draw(contextBoard);
                break;
            default:
                break;
        }
    })
}
