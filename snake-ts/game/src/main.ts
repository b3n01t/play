/**
 * Need game modes:
 *  - Infinite
 *  - eat X food. only one on the board at a time.
 *  - eat all the food in min time. All foods on board to begin with
 *  - 
 */
import { debug, getContext2d, random, updateScore, waitForChar } from '../../lib/utils';
import { GameBoards } from '../../boards/src/index';
import { SnakePlayer } from './snake';
import { CellStates } from '../../boards/src/cell-states';
import { createBoardSelect } from '../../lib/ui-controls/board-select';
import { LoadBoard, SnakeBoard, OneDimBoard } from '../../boards/src/one-dim-board';
import { loose2 } from './loose';

//--
GameBoards.loadLocalStorage((serial: string) => {
    return LoadBoard(serial, SnakeBoard);
});
const selectBoard = localStorage.getItem('last-played') || 'blank';
const select = createBoardSelect(GameBoards.list(), selectBoard);
const selectC = document.getElementById('board-select');
selectC?.appendChild(select);
//--
let PlayBoard = GameBoards.get(selectBoard);

//--
export const run = async (
    ctxSnake: CanvasRenderingContext2D,
    ctxBoard: CanvasRenderingContext2D,
    board: OneDimBoard,
): Promise<boolean> => {
    return new Promise((resolve) => {

        const targetFPS = 60;
        const frameDuration = 1 / (targetFPS * 1000);
        let lastFrameTime = 0;
        let frame = 0;
        let fpsHist: number[] = [];

        let isAlive = true;
        let running = false;
        let looseAnimDone = false;
        let reqAnimationID = 0;
        const looseScreenLoop = loose2(ctxSnake, board);

        const snake = new SnakePlayer(ctxSnake, board);
        board.init(ctxBoard, 1);
        board.draw();
        snake.draw();

        //--
        if (select) {
            select.addEventListener('change', function () {
                PlayBoard = GameBoards.get(this.value);
                localStorage.setItem('last-played', this.value);
                this.blur();
                running = true;
                isAlive = false;
                reqAnimationID = requestAnimationFrame(gameLoop);
                // resolve(false);
            });
        }
        //--
        const runToggle = (key: KeyboardEvent) => {
            if (key.key === ' ') {
                if (running) {
                    cancelAnimationFrame(reqAnimationID);
                } else {
                    reqAnimationID = requestAnimationFrame(gameLoop);
                }
                running = !running;
            }
        }

        document.addEventListener('keydown', snake.controls);
        document.addEventListener('keypress', runToggle);

        //--
        const stop = () => {
            document.removeEventListener('keydown', snake.controls);
            document.removeEventListener('keypress', runToggle);
            cancelAnimationFrame(reqAnimationID);
            running = false;
        }
        //--

        const gameLoop = (time: number) => {
            const diff = time - lastFrameTime;
            if (diff <= frameDuration) {
                reqAnimationID = requestAnimationFrame(gameLoop);
                return;
            }
            frame++;
            //--
            if (isAlive) {
                isAlive = snake.move(time, (nextCell, nextX, nextY) => {
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
                reqAnimationID = requestAnimationFrame(gameLoop);
            } else {
                looseAnimDone = looseScreenLoop(time);
                if (!looseAnimDone) {
                    reqAnimationID = requestAnimationFrame(gameLoop);
                } else {
                    stop();
                    resolve(false);
                }
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
                `is Alive ${isAlive}`,
                `speed: ${snake.state.speed}`
            ]);
            //--
            lastFrameTime = time;
        }
        // do not start immediatly!
        if (running) {
            reqAnimationID = requestAnimationFrame(gameLoop);
        }
    });
}


const main = async () => {
    const worldW = PlayBoard.W;
    const worldH = PlayBoard.H;
    const cellPx = PlayBoard.cellPx;

    const worldWpx = worldW * cellPx;
    const worldHpx = worldH * cellPx;

    const [snakeEl, contextSnake] = getContext2d('canvas-snake', worldWpx, worldHpx);
    const [boardEl, contextBoard] = getContext2d('canvas-board', worldWpx, worldHpx);

    if (contextSnake && contextBoard) {
        while (true) {
            await run(contextSnake, contextBoard, PlayBoard);
            await waitForChar(' ');
        }
    } else {
        console.error('Could not get a CanvasRenderingContext2D');
    }
}

main();
