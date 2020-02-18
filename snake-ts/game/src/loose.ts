import { GameBoards, OneDimBoard } from "../../boards/src/index";
import { CellStates } from "../../boards/src/cell-states";

/**
 * Loose animation
 */

const frameDuration = 1 / 60 * 1000;
// const frameDuration = 1000;
const W = 50;
const H = 30
const cellPx = 15;

const totCell = W * H;
const animationDuration = 5000;

export const loose = (
    ctx: CanvasRenderingContext2D,
    drawing: OneDimBoard,
    next: () => void) => {
    // const drawing = GameBoards.get('loose');
    console.log(drawing);
    const Wpx = drawing.W * drawing.cellPx;
    const Hpx = drawing.H * drawing.cellPx;
    let lastFrameTime = 0;
    let lastCell = 0;
    let done = false;
    ctx.fillStyle = 'rgb(248, 128, 112)';
    ctx.shadowBlur = 0;
    let reqId = 0;
    const loop = (time: number) => {
        if (!done && (time - lastFrameTime < frameDuration)) {
            reqId = requestAnimationFrame(loop);
            return;
        }

        for (let i = 0; i < 50; i++) {
            let x = lastCell % W;
            let y = (lastCell - x) / W;
            x *= cellPx;
            y *= cellPx
            const cell = drawing.getAtId(lastCell);
            switch (cell) {
                case CellStates.WALL:
                    ctx.fillStyle = 'white';
                    break;
                case CellStates.BLANK:
                    ctx.fillStyle = 'rgb(51, 51, 51)';
                    break;
                case CellStates.HEAD:
                    ctx.fillStyle = 'red';
                    break;
                default:
                    ctx.fillStyle = 'teal';
                    break;
            }
            ctx.fillRect(x, y, cellPx, cellPx);
            lastCell++;
        }


        if (lastCell < totCell) {
            reqId = requestAnimationFrame(loop);
        } else {
            ctx.textAlign = 'center';
            ctx.font = 'bold 40px Monaco'; //, "Courier New", monospace
            ctx.shadowBlur = 0;
            ctx.fillStyle = 'rgb(248, 128, 112)'; //'rgb(51, 51, 51)';
            ctx.fillText('OOPS!', Wpx / 2, Hpx / 2 - 40);

            ctx.font = 'bold 20px Monaco'; //, "Courier New", monospace
            ctx.fillText('Press any key to retry.', Wpx / 2, Hpx / 2);
            done = true;
        }

        if (done) {
            const nextKeyHandler = () => {
                // cancelAnimationFrame(reqId);
                document.removeEventListener('keyup', nextKeyHandler);
                next();
            }
            document.addEventListener('keyup', nextKeyHandler)
        }

        lastFrameTime = time;

    }

    // start
    reqId = requestAnimationFrame(loop);
    return reqId;
}