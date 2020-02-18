/**
 * 
 */
import { debug, getContext2d, random, updateScore } from '../../lib/utils';
import { loose } from './loose';


export const run = (
    ctxSnake: CanvasRenderingContext2D,
    ctxBoard: CanvasRenderingContext2D,
    board: OneDimBoard,
    onDie: () => void,
) => {
    const targetFPS = 60;
    const frameDuration = 1 / targetFPS * 1000;
    let lastFrameTime = 0;
    let frame = 0;
    let fpsHist: number[] = [];
    let running = false;

    let reqAnimationID = 0;

    const snake = new SnakePlayer(ctxSnake, board);
    board.init(ctxBoard, 1);
    board.draw();
    snake.draw();

    const runToggle = (key: KeyboardEvent) => {
        console.log('pause Req Id', reqAnimationID);
        if (key.key === ' ') {
            if (running) {
                cancelAnimationFrame(reqAnimationID);
            } else {
                reqAnimationID = requestAnimationFrame(loop1);
            }
            running = !running;
        }
    }

    document.addEventListener('keydown', snake.controls);
    document.addEventListener('keypress', runToggle);

    const stop = () => {
        document.removeEventListener('keydown', snake.controls);
        document.removeEventListener('keypress', runToggle);
        cancelAnimationFrame(reqAnimationID);
        running = false;
    }
    const loop1 = (time: number) => {
        const diff = time - lastFrameTime;
        if (diff <= frameDuration) {
            reqAnimationID = requestAnimationFrame(loop1);
            return;
        }
        frame++;
        //--
        const isAlive = snake.move(time, (nextCell, nextX, nextY) => {
            switch (nextCell) {
                case CellStates.FOOD:
                    let cid = random(0, board.cellCount());
                    while (!board.isCellEmptyAtId(cid)) {
                        cid = random(0, board.cellCount());
                    }
                    board.setAtId(cid, CellStates.FOOD);
                    board.setAtXY(nextX, nextY, CellStates.BLANK);
                    board.refresh();
                    updateScore(snake.state.tailLength);
                default: break;
            }
        });
        snake.draw(time);
        // --
        if (!isAlive) {
            stop();
            onDie();
            return;
        }
        //--
        fpsHist.unshift(1 / (diff / 1000));
        debug([
            `fps: ${fpsHist.slice(0, 10).join('\n')}`,
            `min FPS: ${Math.min(...fpsHist.slice(0, 100))}`,
            `max FPS: ${Math.max(...fpsHist.slice(0, 100))}`,
            'loop1',
            `${frame}`,
            `${diff}`,
            `speed: ${snake.state.speed}`
        ]);
        //--
        lastFrameTime = time;
        reqAnimationID = requestAnimationFrame(loop1);
    }

    // do not start immediatly!
    if (running) {
        reqAnimationID = requestAnimationFrame(loop1);
    }
}

//---
import { GameBoards } from '../../boards/src/index';
import { SnakePlayer } from './snake';
import { CellStates } from '../../boards/src/cell-states';
import { createBoardSelect } from '../../lib/ui-controls/board-select';
import { LoadBoard, SnakeBoard, OneDimBoard } from '../../boards/src/one-dim-board';

const selectBoard = localStorage.getItem('last-played') || 'blank';

GameBoards.loadLocalStorage((serial: string) => {
    return LoadBoard(serial, SnakeBoard);
});

//--
const select = createBoardSelect(GameBoards.list(), selectBoard);
const selectC = document.getElementById('board-select');
selectC?.appendChild(select);
//--

let PlayBoard = GameBoards.get(selectBoard);

const worldW = PlayBoard.W;
const worldH = PlayBoard.H;
const cellPx = PlayBoard.cellPx;

const worldWpx = worldW * cellPx;
const worldHpx = worldH * cellPx;

const [snakeEl, contextSnake] = getContext2d('canvas-snake', worldWpx, worldHpx);
const [boardEl, contextBoard] = getContext2d('canvas-board', worldWpx, worldHpx);

if (contextSnake && contextBoard) {

    const startGame = (board: OneDimBoard) => {
        console.log('START GAME');
        run(contextSnake, contextBoard, board, () => {
            loose(contextSnake, board, () => {
                startGame(PlayBoard);
            });
        });
    }

    startGame(PlayBoard);
    //--
    select.addEventListener('change', function () {
        PlayBoard = GameBoards.get(this.value);
        localStorage.setItem('last-played', this.value);
        startGame(PlayBoard);
        this.blur();
    });
    //--
} else {
    console.error('Could not get a CanvasRenderingContext2D');
}

