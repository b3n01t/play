/**
 * Board Editor
 */

import { getContext2d } from '../../lib/utils';
import { GameBoards, newBlank } from '../../boards/src/index';
import { CellStates } from '../../boards/src/cell-states';

import { createBoardSelect } from '../../lib/ui-controls/board-select';
import { createToolBar } from '../../lib/ui-controls/tool-bar';
import { LoadBoard, SnakeBoard } from '../../boards/src/one-dim-board';

//--

GameBoards.loadLocalStorage((serial: string) => {
    return LoadBoard(serial, SnakeBoard);
});

const opts = GameBoards.list();
const selectedBoard = localStorage.getItem('last-played') || 'blank';

let currentTool = CellStates.WALL;
//--
// const sideBar = document.getElementById('side-bar');
const toolsEl = document.getElementById('tools');

const toolBar = createToolBar([
    { id: 'food', label: '🍏Food', onSelect: () => { currentTool = CellStates.FOOD } },
    { id: 'wall', label: '🧱Wall', onSelect: () => { currentTool = CellStates.WALL } }
], 'wall');
toolsEl?.append(toolBar);

const select = createBoardSelect(opts, selectedBoard);
toolsEl?.prepend(select);

const saveButton = document.createElement('button');
saveButton.innerText = 'Save';
toolsEl?.prepend(saveButton);

const newButton = document.createElement('button');
newButton.innerText = 'New';
toolsEl?.prepend(newButton);
//--

let PlayBoard = GameBoards.get(selectedBoard);
const worldW = PlayBoard.W;
const worldH = PlayBoard.H;
const cellPx = PlayBoard.cellPx;

const worldWpx = worldW * cellPx;
const worldHpx = worldH * cellPx;

const boardNameEl = document.getElementById('board-name');
if (boardNameEl) {
    boardNameEl.innerText = selectedBoard;
}

const [canvasEl, contextBoard] = getContext2d('canvas-board', worldWpx, worldHpx);
const [canvasElDraw, contextBoardDraw] = getContext2d('canvas-board-draw', worldWpx, worldHpx);
let name = selectedBoard;
if (canvasEl && canvasElDraw && contextBoard && contextBoardDraw) {
    //--
    PlayBoard.init(contextBoard);
    PlayBoard.draw();
    //--
    //--
    select.addEventListener('change', function () {
        contextBoard.clearRect(0, 0, worldWpx, worldHpx);
        name = this.value;
        PlayBoard = GameBoards.get(this.value);
        PlayBoard.init(contextBoard);
        PlayBoard.draw();
        localStorage.setItem('last-played', this.value);
        this.blur();
    });

    saveButton.addEventListener('click', function () {
        const namePrompt = prompt('Enter Boar name', name);
        const newName = namePrompt ? namePrompt : name;
        GameBoards.save(newName, PlayBoard);
        this.blur();
    });

    newButton.addEventListener('click', function () {
        const sure = confirm('Are you sure?');
        if (sure) {
            PlayBoard = newBlank();
            PlayBoard.init(contextBoard);
            contextBoard.clearRect(0, 0, worldWpx, worldHpx);
            PlayBoard.draw();
        }
        this.blur();
    });
    //--

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

        if (e.shiftKey || e.buttons) {
            PlayBoard.setAtXY(cellX, cellY, CellStates.WALL);
        }
        if (e.ctrlKey) {
            PlayBoard.setAtXY(cellX, cellY, CellStates.BLANK);
        }

        requestAnimationFrame(() => {
            PlayBoard.draw();
            contextBoardDraw.clearRect(0, 0, worldWpx, worldHpx);
            contextBoardDraw.fillStyle = 'red';
            contextBoardDraw.fillRect(cx, cy, PlayBoard.cellPx, PlayBoard.cellPx);
            contextBoardDraw.stroke();
        });
    }

    document.addEventListener('keypress', (key) => {
        switch (key.key) {
            case ' ':
                PlayBoard.setAtXY(cellX, cellY, currentTool);
                PlayBoard.draw();
                break;
            case 'c':
                PlayBoard.setAtXY(cellX, cellY, CellStates.BLANK);
                PlayBoard.draw();
                break;
            default:
                break;
        }
    });

    document.addEventListener('keyup', () => {
        console.log(PlayBoard.serialize());
        GameBoards.save('draft', PlayBoard);
    });
}
