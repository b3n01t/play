/**
 * utilities
 */

const debugEl = document.getElementById('debug');
export const debug = (txt: string | string[]) => {
    if (debugEl) {
        const t = Array.isArray(txt) ? txt.join("\n") : txt;
        debugEl.innerHTML = `<pre>${t}</pre>`;
    } else {
        console.log(txt);
    }
};

const gameStatus = document.getElementById('game-status');
const gameScrore = document.getElementById('score');
export const updateScore = (score: string | number) => {
    if (gameScrore) {
        gameScrore.innerText = `${score}`;
    }
}

export const getContext2d = (canvasId: string, width: number, height: number): CanvasRenderingContext2D | null => {
    const canvasEl = document.getElementById(canvasId) as HTMLCanvasElement | null;
    if (canvasEl) {
        canvasEl.width = width;
        canvasEl.height = height;
        const context = canvasEl.getContext('2d') as CanvasRenderingContext2D;
        return context;
    } else {
        document.body.innerHTML = `<div> Add a \<canvas id="${`canvasId`}"/\> element to this html </div>`;
    }
    return null;
};

export const random = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};