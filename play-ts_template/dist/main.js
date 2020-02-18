/**
 * utilities
 */
define("utils", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const debugEl = document.getElementById('debug');
    exports.debug = (txt) => {
        if (debugEl) {
            debugEl.innerHTML = `<pre>${txt}</pre>`;
        }
        else {
            console.log(txt);
        }
    };
});
define("main", ["require", "exports", "utils"], function (require, exports, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.run = (canvasId, debug = () => { }) => {
        const cellW = 15;
        const cellH = 15;
        const worldW = 50;
        const worldH = 30;
        const worldWpx = worldW * cellW;
        const worldHpx = worldH * cellH;
        const canvasEl = document.getElementById(canvasId);
        const targetFPS = 60;
        let frameDuration = (1 / targetFPS) * 1000;
        let lastFrameTime = 0;
        let frame = 0;
        let c;
        console.log('RUN !!!');
        const squareSide = 10;
        const circle = new Path2D();
        const loop1 = (time) => {
            const diff = time - lastFrameTime;
            if (diff <= (frameDuration)) {
                return requestAnimationFrame(loop1);
            }
            frame++;
            if (c) {
                c.fillStyle = 'red';
                lastFrameTime = time;
                // c.clearRect(0, 0, worldWpx, worldHpx);
                const x = (worldWpx / 2) - squareSide / 2 + ((worldWpx / 2) - squareSide / 2) * Math.sin(2 * 3.14159 * (.05 / 1000) * time);
                const y = (worldHpx / 2) - squareSide / 2 + ((worldHpx / 2) - squareSide / 2) * Math.cos(2 * 3.14159 * (.025 / 1000) * time);
                // c.fillRect(x, y, squareSide, squareSide);
                c.beginPath();
                c.arc(x, y, squareSide, 0, 2 * Math.PI);
                c.fill();
            }
            debug(`
    fps: ${1 / (diff / 1000)}
    loop1
    ${frame}
    `);
            // if (frame % (targetFPS * 3) === 0){
            //     return requestAnimationFrame(loop2);
            // }
            return requestAnimationFrame(loop1);
        };
        const loop2 = (time) => {
            const diff = time - lastFrameTime;
            if (diff <= (frameDuration)) {
                return requestAnimationFrame(loop2);
            }
            frame++;
            if (c) {
                c.fillStyle = 'green';
                lastFrameTime = time;
                // c.clearRect(0, 0, worldWpx, worldHpx);
                const x = (worldWpx / 2) - 25 + ((worldWpx / 2) - 25) * Math.sin(2 * 3.14159 * (.1 / 1000) * time);
                const y = (worldHpx / 2) - 25 + ((worldHpx / 2) - 25) * Math.cos(2 * 3.14159 * (.1 / 1000) * time);
                c.fillRect(x, y, 50, 50);
            }
            debug(`
    fps: ${1 / (diff / 1000)}
    loop2
    ${frame}
        `);
            if (frame % (targetFPS * 3) === 0) {
                return requestAnimationFrame(loop1);
            }
            return requestAnimationFrame(loop2);
        };
        if (canvasEl) {
            canvasEl.width = worldWpx;
            canvasEl.height = worldHpx;
            c = canvasEl.getContext('2d');
            requestAnimationFrame(loop1);
        }
        else {
            document.body.innerHTML = `<div> Add a canvas element to this html </div>`;
        }
    };
    exports.run('canvas', utils_1.debug);
});
/**
 * Boards
 */
define("boards/index", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("boards/blank", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Blank = {
        W: 50,
        H: 30,
        cells: (new Array(50 * 30)).fill(0, 50 * 30),
    };
    exports.default = Blank;
});
