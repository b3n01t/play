let debugLines = [];
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function cellIdToXY(id, W) {
    const x = id % W;
    const y = (id - x) / W;
    return { x, y };
}
function XYToCellId(x, y, W) {
    return y * W + x;
}
const debugEl = document.getElementById('debug');
const CEl = document.getElementById('canvas');
const c = CEl.getContext('2d');

//--
const BLANK = 0;
const HEAD = 1;
const TAIL = 2;
const FOOD = 3;
//--
const NORTH = 0;
const EAST = 1;
const SOUTH = 2;
const WEST = 3;
//--
const snake = {
    direction: WEST,
    head: {
        x: 35,
        y: 15
    },
    tail: [],
    // tail: [{ x: 36, y: 15 }, { x: 37, y: 15 }, { x: 38, y: 15 }, { x: 39, y: 15 }, { x: 40, y: 15 }],
    tailLength: 3,
};
let food = {
    x: 25,
    y: 15,
};

const cellW = 15;
const cellH = 15;

const worldW = 50;
const worldH = 30;
const worldWpx = worldW * cellW;
const worldHpx = worldH * cellH;

CEl.width = worldWpx;
CEl.height = worldHpx;
//--
const worldMap = new Array(worldW * worldH);
worldMap.fill(0, 0, worldW * worldH);
console.log(worldMap);
worldMap.forEach((cellState, cellId) => {
    const xy = cellIdToXY(cellId, worldW);
    console.log(cellId, xy[0], xy[1], XYToCellId(xy[0], xy[1], worldW));
})
worldMap[XYToCellId(food.x, food.y, worldW)] = FOOD;
worldMap[XYToCellId(snake.head.x, snake.head.y, worldW)] = HEAD;
snake.tail.forEach((tailPart) => {
    worldMap[XYToCellId(tailPart.x, tailPart.y, worldW)] = TAIL;
})

//--
let running = true;
document.addEventListener('keypress', (key) => {
    console.log(key);
    if (key.key === ' ') {
        if (running) {
            cancelAnimationFrame(reqAnimationID);
        } else {
            GameLoop();
        }
        running = !running;
    }

});
document.addEventListener('keydown', (key) => {
    console.log(key);
    /**
            0
          3   1
            2
    */
    // switch (key.key) {
    //     case 'ArrowRight': snake.direction = (snake.direction + 1) % 4; break;
    //     case 'ArrowLeft': snake.direction = snake.direction - 1 < 0 ? 3 : snake.direction - 1; break;
    // }
    switch (key.key) {
        case 'ArrowRight': snake.direction = EAST; break;
        case 'ArrowUp': snake.direction = NORTH; break;
        case 'ArrowLeft': snake.direction = WEST; break;
        case 'ArrowDown': snake.direction = SOUTH; break;
    }

});
//--
let lastFrameTime = 0;
let nextFrameTime = 0;
let frame = 0;
let reqAnimationID = null;
let targetFPS = 10 / 1000;

let isDead = false;

const GameLoop = (currentTime) => {
    running = true;
    const diff = currentTime - lastFrameTime;
    if (diff < 1 / targetFPS) {
        reqAnimationID = requestAnimationFrame(GameLoop);
        return;
    } else {
        lastFrameTime = currentTime;
        frame++;
    }
    //-- Loose Screen
    if (isDead) {
        targetFPS = 60 / 1000;
        // c.fillStyle = '#c586c0';
        c.fillStyle = 'rgba(14, 99, 156, 0.8)';
        // const lastId = ;
        for (let id = lastX; id < lastX + worldW; id++) {
            // let id = random(0,worldMap.length);
            if (worldMap[id] !== BLANK) {
                // id++;
                continue;
            }
            // while(worldMap[id] !== BLANK){
            // id = random(0,worldMap.length);
            // }
            worldMap[id] = 'X';
            const { x, y } = cellIdToXY(id, worldW);
            c.fillRect(1 + x * cellW, 1 + y * cellH, cellW - 2, cellH - 2);
        }


        reqAnimationID = requestAnimationFrame(GameLoop);
        return;
    }

    //-- Clear the world
    worldMap.fill(0, 0, worldW * worldH);

    //-- Set the food.
    worldMap[XYToCellId(food.x, food.y, worldW)] = FOOD;

    //-- 
    let nextHead = { ...snake.head };
    switch (snake.direction) {
        case NORTH: {
            nextHead.y -= 1; break;
        }
        case EAST: {
            nextHead.x += 1; break;
        }
        case SOUTH: {
            nextHead.y += 1; break;
        }
        case WEST: {
            nextHead.x -= 1; break;
        }
    }

    snake.tail.unshift({ ...snake.head });
    snake.tail = snake.tail.slice(0, snake.tailLength);
    snake.tail.forEach((tailPart) => {
        worldMap[XYToCellId(tailPart.x, tailPart.y, worldW)] = TAIL;
    });

    debugLines.unshift(worldMap[XYToCellId(nextHead.x, nextHead.y, worldW)]);
    switch (worldMap[XYToCellId(nextHead.x, nextHead.y, worldW)]) {
        case FOOD: {
            snake.tailLength += 3;
            let cid = random(0, worldMap.length);
            while (worldMap[cid] !== BLANK) {
                cid = random(0, worldMap.length);
            }
            worldMap[cid] = FOOD;
            food = cellIdToXY(cid, worldW);
            break;
        }
        case BLANK: break;
        default: {
            isDead = true;
            break;
        }
    }

    //-- All clear, Move to next
    snake.head = { ...nextHead };
    worldMap[XYToCellId(snake.head.x, snake.head.y, worldW)] = HEAD;

    //-- render
    worldMap.forEach((cellState, cellId) => {
        const { x, y } = cellIdToXY(cellId, worldW);
        switch (cellState) {
            case FOOD:
                c.fillStyle = 'rgb(115, 201, 145)';
                break;
            case HEAD:
                c.fillStyle = 'red';
                break;
            case TAIL:
                c.fillStyle = 'black';
                break;
            default:
                c.fillStyle = 'white';
                break;
        }
        c.fillRect(1 + x * cellW, 1 + y * cellH, cellW - 1, cellH - 1);
    });

    //-- debug
    const fps = (1 / (diff / 1000)).toFixed(5);
    // c.fillText(`${fps} - ${frame}`, 10, 10);
    debugEl.innerHTML =
        `<pre>
FPS: ${fps} - ${frame}
SNAKE:
- Direction ${snake.direction}
- FOOD: ${JSON.stringify(food)}
- Tail: ${snake.tail.length}
- isDead: ${isDead}
- extra: ${debugLines.slice(0, 50)}
</pre>`;
    reqAnimationID = requestAnimationFrame(GameLoop);
    return;
}

GameLoop();
