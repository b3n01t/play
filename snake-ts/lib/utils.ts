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

export const getContext2d = (canvasId: string, width: number, height: number): [HTMLCanvasElement, CanvasRenderingContext2D] => {
    const canvasEl = document.getElementById(canvasId) as HTMLCanvasElement | null;
    if (canvasEl) {
        canvasEl.width = width;
        canvasEl.height = height;
        const context = canvasEl.getContext('2d') as CanvasRenderingContext2D;
        return [canvasEl, context];
    } else {
        document.body.innerHTML = `<div> Add a \<canvas id="${canvasId}"/\> element to this html </div>`;
        throw new Error(`canvas with id ${canvasId} Not found`);
    }
};

export const random = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const waitForChar = async (char: string) => {
    return new Promise((resolve) => {
        const go = (e: KeyboardEvent) => {
            if (e.key === char) {
                document.removeEventListener('keypress', go);
                resolve();
            }
        }
        document.addEventListener('keypress', go);
    });
}
