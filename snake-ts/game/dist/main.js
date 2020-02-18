"use strict";
class GameManager {
    start() {
    }
    stop() {
    }
    pause() {
    }
    restart() {
    }
}
/**
 * Board states
 */
define("boards/src/cell-states", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CellStates;
    (function (CellStates) {
        CellStates["BLANK"] = "0";
        CellStates["HEAD"] = "@";
        CellStates["TAIL"] = "=";
        CellStates["FOOD"] = "3";
        CellStates["POWER_FOOD"] = "4";
        CellStates["POISON_FOOD"] = "5";
        CellStates["WALL"] = "9";
    })(CellStates = exports.CellStates || (exports.CellStates = {}));
    ;
});
/**
 * utilities
 */
define("lib/utils", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const debugEl = document.getElementById('debug');
    exports.debug = (txt) => {
        if (debugEl) {
            const t = Array.isArray(txt) ? txt.join("\n") : txt;
            debugEl.innerHTML = `<pre>${t}</pre>`;
        }
        else {
            console.log(txt);
        }
    };
    const gameStatus = document.getElementById('game-status');
    const gameScrore = document.getElementById('score');
    exports.updateScore = (score) => {
        if (gameScrore) {
            gameScrore.innerText = `${score}`;
        }
    };
    exports.getContext2d = (canvasId, width, height) => {
        const canvasEl = document.getElementById(canvasId);
        if (canvasEl) {
            canvasEl.width = width;
            canvasEl.height = height;
            const context = canvasEl.getContext('2d');
            return [canvasEl, context];
        }
        else {
            document.body.innerHTML = `<div> Add a \<canvas id="${canvasId}"/\> element to this html </div>`;
            throw new Error(`canvas with id ${canvasId} Not found`);
        }
    };
    exports.random = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
});
define("boards/src/one-dim-board", ["require", "exports", "lib/utils", "boards/src/cell-states"], function (require, exports, utils_1, cell_states_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * OneDimBoard
     *  Cells in a 1 dimension array
     */
    class OneDimBoard {
        constructor(W, H, cellPx, cells, bgColor = 'white') {
            this.W = W;
            this.H = H;
            this.cellPx = cellPx;
            this.cells = cells;
            this.bgColor = bgColor;
            this.originalCell = [];
            if (cells.length !== W * H) {
                throw new Error(`Invalid Board setup: ${cells.length} !== ${W} * ${H} `);
            }
            this.originalCell = [...cells];
        }
        // Concert the index in the cells arry to x y coordinates in the board space
        cellIdToXY(id) {
            const x = id % this.W;
            const y = (id - x) / this.W;
            return { x, y };
        }
        // Concert x y coordinates in the board space to the index in the cells array
        XYToCellId(x, y) {
            return y * this.W + x;
        }
        // Given x y coordinates from pixel space, return the cell's coordinate in the pixel space
        //      usefull for mouse interactions
        //      e.g.: cellW = 15px , x = 20px => 15px
        XYPxToCellXYPx(xPx, yPx) {
            const x = xPx - (xPx % this.cellPx);
            const y = yPx - (yPx % this.cellPx);
            return { x, y };
        }
        // Convert x y coordinates from pixel space to the Board space
        XYPxToXYBoard(xPx, yPx) {
            const { x, y } = this.XYPxToCellXYPx(xPx, yPx);
            return {
                x: x / this.cellPx,
                y: y / this.cellPx,
            };
        }
        getAtId(id) {
            return this.cells[id];
        }
        getAtXY(x, y) {
            return this.cells[this.XYToCellId(x, y)];
        }
        setAtId(id, val) {
            this.cells[id] = val;
        }
        setAtXY(x, y, val) {
            this.cells[this.XYToCellId(x, y)] = val;
        }
        isCellEmptyAtId(id) {
            return this.getAtId(id) === cell_states_1.CellStates.BLANK;
        }
        isCellEmptyAtXY(x, y) {
            return this.getAtXY(x, y) === cell_states_1.CellStates.BLANK;
        }
        cellCount() {
            return this.cells.length;
        }
        serialize(name) {
            return JSON.stringify({
                name,
                W: this.W,
                H: this.H,
                cells: this.cells.join(''),
            });
        }
    }
    exports.OneDimBoard = OneDimBoard;
    // https://stackoverflow.com/questions/39614311/class-constructor-type-in-typescript
    // type BoardConstructor = new <T>(W: number, H: number, cellPx: number, cells: Array<CellState>, bgColor: string) => T;
    exports.LoadBoard = (serial, BoardClass) => {
        const jsonBoard = JSON.parse(serial);
        const { W, H, cells } = jsonBoard;
        const cellPx = 15;
        const cellArray = cells.split('');
        const bgColor = 'white';
        const boardInstance = new BoardClass(W, H, cellPx, cellArray, bgColor);
        console.log(boardInstance);
        return boardInstance;
    };
    //--
    class SnakeBoard extends OneDimBoard {
        constructor(W, H, cellPx, cells, bgColor = 'white') {
            super(W, H, cellPx, cells, bgColor);
            this.W = W;
            this.H = H;
            this.cellPx = cellPx;
            this.cells = cells;
            this.bgColor = bgColor;
            this.c = null;
        }
        init(c, foodCount) {
            if (this.c === null) {
                this.c = c;
            }
            this.cells = [...this.originalCell];
            let hasFood = false;
            for (let i = 0; i < this.cells.length; i++) {
                const state = this.cells[i];
                // Make sure there is some food;
                if (state === cell_states_1.CellStates.FOOD) {
                    hasFood = true;
                    break;
                }
                // Remove dead snake parts
                if (state === cell_states_1.CellStates.HEAD || state === cell_states_1.CellStates.TAIL) {
                    this.setAtId(i, cell_states_1.CellStates.BLANK);
                }
            }
            if (!hasFood && foodCount) {
                for (let i = 0; i < foodCount; i++) {
                    let cid = utils_1.random(0, this.cellCount());
                    while (!this.isCellEmptyAtId(cid)) {
                        cid = utils_1.random(0, this.cellCount());
                    }
                    this.setAtId(cid, cell_states_1.CellStates.FOOD);
                }
            }
        }
        drawStateAt(x, y, state) {
            const cellW = this.cellPx;
            const cellH = this.cellPx;
            if (this.c) {
                switch (state) {
                    case cell_states_1.CellStates.FOOD:
                        // food needs to be an object
                        this.c.shadowBlur = 0;
                        this.c.shadowColor = this.c.fillStyle = this.bgColor;
                        this.c.fillRect(x * cellW, y * cellH, cellW, cellH);
                        this.c.shadowColor = this.c.fillStyle = 'rgb(115, 201, 145)';
                        this.c.beginPath();
                        this.c.arc(x * cellW + (cellW / 2), y * cellH + (cellH / 2), cellW / 2, 0, 2 * Math.PI);
                        this.c.fill();
                        break;
                    case cell_states_1.CellStates.WALL:
                        this.c.shadowBlur = 1;
                        this.c.shadowColor = this.c.fillStyle = 'rgb(51, 51, 51)';
                        this.c.fillRect(x * cellW, y * cellH, cellW, cellH);
                        break;
                    case cell_states_1.CellStates.BLANK:
                        this.c.shadowBlur = 0;
                        this.c.shadowColor = this.c.fillStyle = this.bgColor;
                        this.c.fillRect(x * cellW, y * cellH, cellW, cellH);
                        break;
                    default:
                        this.c.shadowBlur = 0;
                        // this.c.shadowColor = this.c.fillStyle = 'blue';
                        this.c.shadowColor = this.c.fillStyle = this.bgColor;
                        this.c.fillRect(x * cellW, y * cellH, cellW, cellH);
                        break;
                }
            }
            else {
                throw new Error('No Context!');
            }
        }
        draw(time) {
            this.cells.forEach((cellState, cellId) => {
                const { x, y } = this.cellIdToXY(cellId);
                this.drawStateAt(x, y, cellState);
            });
        }
        refresh() {
            if (this.c) {
                this.draw();
            }
            else {
                console.error('Cannot Refresh, Don\'t have a canvas');
            }
        }
    }
    exports.SnakeBoard = SnakeBoard;
});
define("boards/src/boards/blank", ["require", "exports", "boards/src/one-dim-board", "boards/src/cell-states"], function (require, exports, one_dim_board_1, cell_states_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //--
    const Width = 50;
    const Height = 30;
    const cellPx = 15;
    const l = Width * Height;
    const Cells = new Array(l);
    Cells.fill(cell_states_2.CellStates.BLANK, 0, l);
    //--
    exports.BlankBoard = new one_dim_board_1.SnakeBoard(Width, Height, cellPx, Cells);
});
define("boards/src/boards/walls-around", ["require", "exports", "boards/src/one-dim-board"], function (require, exports, one_dim_board_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //--
    const Width = 50;
    const Height = 30;
    const cellPx = 15;
    const Cells = `
99999999999999999999999999999999999999999999999999
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
9                                                9
9                                                9
9                                                9
99999999999999999999999999999999999999999999999999
`.replace(/\n/g, '').replace(/ /g, '0').split('');
    //--
    exports.WallsAroundBoard = new one_dim_board_2.SnakeBoard(Width, Height, cellPx, Cells);
});
define("boards/src/boards/walls-with-holes", ["require", "exports", "boards/src/one-dim-board"], function (require, exports, one_dim_board_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //--
    const Width = 50;
    const Height = 30;
    const cellPx = 15;
    const Cells = `
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
`.replace(/\n/g, '').replace(/ /g, '0').split('');
    //--
    exports.WallsWithWalls = new one_dim_board_3.SnakeBoard(Width, Height, cellPx, Cells);
});
define("boards/src/boards/walls-with-holes-2", ["require", "exports", "boards/src/one-dim-board"], function (require, exports, one_dim_board_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //--
    const Width = 50;
    const Height = 30;
    const cellPx = 15;
    const Cells = `
99999999999999999999999   999999999999999999999999
9                                                9
9                                                9
9                                                9
9                                                9
9         999                         999        9
9         999           3             999        9
9         999                         999        9
9                                                9
9                                                9
9                                                9
9                                                9
9                                                9
9                                                9
                       999                        
           3           999                        
                       999                        
9                                                9
9                                                9
9                                                9
9         999                         999        9
9         999           3             999        9
9         999                         999        9
9                                                9
9                                                9
9                                                9
9                                                9
9                                                9
9                                                9
99999999999999999999999   999999999999999999999999
`.replace(/\n/g, '').replace(/ /g, '0').split('');
    //--
    exports.WallsWithWalls2 = new one_dim_board_4.SnakeBoard(Width, Height, cellPx, Cells);
});
define("boards/src/boards/walls-with-holes-3", ["require", "exports", "boards/src/one-dim-board"], function (require, exports, one_dim_board_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //--
    const Width = 50;
    const Height = 30;
    const cellPx = 15;
    const Cells = `
99999999999999999999999   999999999999999999999999
9                                                9
9                                                9
9                                                9
9                                                9
9         999                         999        9
9         999           3             999        9
9         999                         999        9
9                                      9         9
9                                      9         9
9                                      9         9
9                                      9         9
9                                      9         9
9                                      9         9
                       999             9          
           3           999      3      9          
                       999             9          
9                                      9         9
9                                      9         9
9                                      9         9
9         999                         999        9
9         999           3             999        9
9         999                         999        9
9                                                9
9                                                9
9                                                9
9                                                9
9                                                9
9                                                9
99999999999999999999999   999999999999999999999999
`.replace(/\n/g, '').replace(/ /g, '0').split('');
    exports.WallsWithWalls3 = new one_dim_board_5.SnakeBoard(Width, Height, cellPx, Cells);
});
define("boards/src/boards/wolf", ["require", "exports", "boards/src/one-dim-board"], function (require, exports, one_dim_board_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //--
    const Width = 50;
    const Height = 30;
    const cellPx = 15;
    const Cells = `
9999999999999999999999                            
999999 999 9999999999                             
  99          9                                   
99            9 9                                 
999           9999                                
 9999         99 99                               
  9999       99 9 9                               
    9999999999    99999                           
     999999999    9 9 9                           
    99999999999  9 9 99                           
    999999999999999999                            
   9999999999999                                  
   999999999999                                   
   9 999999 99                                    
   9 9 9 99 9                                     
999999999999999999999999999                       
                                                  
                                 3                
                                                  
                                                  
                                                  
                                                  
                                                  
                                                  
           3                                      
                                                  
                                                  
                                                  
                                                  
                                                  
`.replace(/\n/g, '').replace(/ /g, '0').split('');
    exports.Wolf = new one_dim_board_6.SnakeBoard(Width, Height, cellPx, Cells);
});
define("boards/src/boards/wolf2", ["require", "exports", "boards/src/one-dim-board"], function (require, exports, one_dim_board_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //--
    const Width = 50;
    const Height = 30;
    const cellPx = 15;
    const BoardTxt = `
                                                  
                                                  
                                                  
                                                  
                  3                               
                                                  
                                                  
                                                  
                                                  
                                                  
                                  3               
                                                  
                                                  
                                                  
9999999999999999999999                            
999999 999 9999999999                             
              9                                   
99            9 9                   3             
999           9999                                
 9999         99 99                               
  9999       99 9 9                               
    9999999999    99999                           
     999999999    9 9 9                           
    99999999999  9 9 99                           
    999999999999999999                            
   9999999999999                                  
   999999999999                                   
   9 999999 99                                    
   9 9 9 99 9                                     
999999999999999999999999999                       
`;
    const Cells = BoardTxt.replace(/\n/g, '').replace(/ /g, '0').split('');
    exports.Wolf2 = new one_dim_board_7.SnakeBoard(Width, Height, cellPx, Cells);
});
define("boards/src/boards/tree", ["require", "exports", "boards/src/one-dim-board"], function (require, exports, one_dim_board_8) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Width = 50;
    const Height = 30;
    const cellPx = 15;
    const BoardTxt = `
             9       99 9   9   9    9     9      
        9    99   99 9  99  99 99    9    99      
         9    9    9999  9   999    9    99       
         99   99    99   99  9    99     9        
          99   999 99     9  9   99    999        
           9     999    9  999  99    9999        
           9  999999   99  99   999   9  9        
         9999999   99 99  99   99 99999  99       
        99        99999   9   999   9     9       
       99        99  99   9  99 9   99   99       
                99    99 99 99  99       9        
            99999      999999    9       99       
             99        999999   9         9       
             9         999999   99       99       
             99        999999    9       9        
             99        999999   99       9        
              9        999999   9        99       
             99        999999   99        9       
             9         999999    9        9       
             9         999999   99        9       
             9         999999   9        99       
             99        999999   99       9        
             9        99999999   9       9        
             9       9999999999          9        
             99      9999999999          99       
              9     999999999999          9       
             99    99999999999999        99       
             9     99999999999999        9        
             9    9999999999999999       99       
             9    9999999999999999        9       
`;
    const Cells = BoardTxt.replace(/\n/g, '').replace(/ /g, '0').split('');
    exports.Tree = new one_dim_board_8.SnakeBoard(Width, Height, cellPx, Cells);
});
define("boards/src/registry", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class BoardRegistry {
        constructor() {
            this.registry = {};
        }
        get(name) {
            if (this.registry[name] === undefined) {
                throw new Error(`Board ${name} does not not exist`);
            }
            return this.registry[name];
        }
        add(name, board) {
            this.registry[name] = board;
        }
        save(name, board) {
            this.add(name, board);
            localStorage.setItem(`SB-${name}`, board.serialize(name));
            console.log('Saved!', `SB-${name}`);
        }
        list() {
            return Object.keys(this.registry).sort();
        }
        loadLocalStorage(loader) {
            Object.keys(localStorage).forEach((key) => {
                if (key.startsWith('SB-')) {
                    console.log(key);
                    const serial = localStorage.getItem(key);
                    if (serial) {
                        const board = loader(serial);
                        // const board: OneDimBoard = LoadBoard(serial, SnakeBoard);
                        const boardName = key.replace('SB-', '');
                        this.add(boardName, board);
                    }
                }
            });
        }
    }
    exports.GameBoards = new BoardRegistry();
});
define("boards/src/index", ["require", "exports", "boards/src/cell-states", "boards/src/one-dim-board", "boards/src/boards/blank", "boards/src/boards/walls-around", "boards/src/boards/walls-with-holes", "boards/src/boards/walls-with-holes-2", "boards/src/boards/walls-with-holes-3", "boards/src/boards/wolf", "boards/src/boards/wolf2", "boards/src/boards/tree", "boards/src/registry", "boards/src/one-dim-board"], function (require, exports, cell_states_3, one_dim_board_9, blank_1, walls_around_1, walls_with_holes_1, walls_with_holes_2_1, walls_with_holes_3_1, wolf_1, wolf2_1, tree_1, registry_1, one_dim_board_10) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.OneDimBoard = one_dim_board_9.OneDimBoard;
    exports.GameBoards = registry_1.GameBoards;
    registry_1.GameBoards.add('blank', blank_1.BlankBoard);
    registry_1.GameBoards.add('wall-around', walls_around_1.WallsAroundBoard);
    registry_1.GameBoards.add('wall-holes', walls_with_holes_1.WallsWithWalls);
    registry_1.GameBoards.add('wall-holes2', walls_with_holes_2_1.WallsWithWalls2);
    registry_1.GameBoards.add('wall-holes3', walls_with_holes_3_1.WallsWithWalls3);
    registry_1.GameBoards.add('wolf', wolf_1.Wolf);
    registry_1.GameBoards.add('wolf2', wolf2_1.Wolf2);
    registry_1.GameBoards.add('tree', tree_1.Tree);
    exports.newBlank = () => {
        const Width = 50;
        const Height = 30;
        const cellPx = 15;
        const l = Width * Height;
        const Cells = new Array(l);
        Cells.fill(cell_states_3.CellStates.BLANK, 0, l);
        const BlankBoard = new one_dim_board_10.SnakeBoard(Width, Height, cellPx, Cells);
        return BlankBoard;
    };
});
define("game/src/loose", ["require", "exports", "boards/src/cell-states"], function (require, exports, cell_states_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Loose animation
     */
    const frameDuration = 1 / 60 * 1000;
    // const frameDuration = 1000;
    const W = 50;
    const H = 30;
    const cellPx = 15;
    const totCell = W * H;
    const animationDuration = 5000;
    exports.loose = (ctx, drawing, next) => {
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
        const loop = (time) => {
            if (!done && (time - lastFrameTime < frameDuration)) {
                reqId = requestAnimationFrame(loop);
                return;
            }
            for (let i = 0; i < 50; i++) {
                let x = lastCell % W;
                let y = (lastCell - x) / W;
                x *= cellPx;
                y *= cellPx;
                const cell = drawing.getAtId(lastCell);
                switch (cell) {
                    case cell_states_4.CellStates.WALL:
                        ctx.fillStyle = 'white';
                        break;
                    case cell_states_4.CellStates.BLANK:
                        ctx.fillStyle = 'rgb(51, 51, 51)';
                        break;
                    case cell_states_4.CellStates.HEAD:
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
            }
            else {
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
                };
                document.addEventListener('keyup', nextKeyHandler);
            }
            lastFrameTime = time;
        };
        // start
        reqId = requestAnimationFrame(loop);
        return reqId;
    };
});
define("game/src/snake", ["require", "exports", "boards/src/cell-states"], function (require, exports, cell_states_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const NORTH = 0;
    const EAST = 1;
    const SOUTH = 2;
    const WEST = 3;
    class SnakePlayer {
        constructor(ctx, board) {
            this.ctx = ctx;
            this.board = board;
            this.state = {
                alive: true,
                direction: WEST,
                speed: 6,
                lastTick: 0,
                tailLength: 3,
                head: { x: 35, y: 15 },
                tail: [{ x: 36, y: 15 }, { x: 37, y: 15 }, { x: 38, y: 15 }],
            };
            this.timers = {
                foodStart1: 0
            };
            this.controls = this.controls.bind(this);
        }
        controls(key) {
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
                case 'ArrowRight':
                    this.state.direction = EAST;
                    break;
                case 'ArrowUp':
                    this.state.direction = NORTH;
                    break;
                case 'ArrowLeft':
                    this.state.direction = WEST;
                    break;
                case 'ArrowDown':
                    this.state.direction = SOUTH;
                    break;
                case '=':
                    this.state.speed += 1;
                    break;
                case '-':
                    this.state.speed -= 1;
                    break;
                default: break;
            }
        }
        draw(time) {
            const t = time ? time : 0;
            const c = this.ctx;
            c.shadowBlur = 2;
            c.clearRect(0, 0, this.board.cellPx * this.board.W, this.board.cellPx * this.board.H);
            c.shadowColor = c.fillStyle = 'red';
            c.fillRect(this.state.head.x * this.board.cellPx, this.state.head.y * this.board.cellPx, this.board.cellPx, this.board.cellPx);
            c.fillStyle = 'black';
            this.state.tail.forEach((tailPart, tailIdx) => {
                // if (this.state.tail.length !== this.state.tailLength) {
                if (this.timers.foodStart1 > 0 && (t - this.timers.foodStart1 < 2000)) {
                    // Growing!
                    const hue = Math.sin(tailIdx + 2 * 3.314159 * 1 / 10000 * t) * 360;
                    const lighness = Math.sin(tailIdx + 2 * 3.314159 * t) + 60;
                    c.shadowColor = c.fillStyle = `hsl(${hue},100%, ${lighness}%)`;
                    c.shadowBlur = 12;
                    c.fillRect(tailPart.x * this.board.cellPx + 1 + Math.sin(3.314159 / 3 * t), tailPart.y * this.board.cellPx + 1 + Math.sin(3.314159 / 3 * t), this.board.cellPx - 2 - Math.sin(3.314159 / 3 * t), this.board.cellPx - 2 - Math.sin(3.314159 / 3 * t));
                }
                else {
                    // c.shadowColor = ;
                    c.shadowBlur = 0;
                    c.fillRect(tailPart.x * this.board.cellPx + 1, tailPart.y * this.board.cellPx + 1, this.board.cellPx - 2, this.board.cellPx - 2);
                }
            });
        }
        move(time, update) {
            if (time) {
                const delta = time - this.state.lastTick;
                if (delta < 1 / this.state.speed * 1000) {
                    return this.state.alive;
                }
                this.state.lastTick = time;
            }
            const nextHead = Object.assign({}, this.state.head);
            switch (this.state.direction) {
                case NORTH: {
                    const nextY = nextHead.y - 1;
                    if (nextY < 0) {
                        nextHead.y = this.board.H - 1;
                    }
                    else {
                        nextHead.y = nextY;
                        break;
                    }
                    break;
                }
                case EAST: {
                    const nextX = nextHead.x + 1;
                    if (nextX >= this.board.W) {
                        nextHead.x = 0;
                    }
                    else {
                        nextHead.x = nextX;
                    }
                    break;
                }
                case SOUTH: {
                    const nextY = nextHead.y + 1;
                    if (nextY >= this.board.H) {
                        nextHead.y = 0;
                    }
                    else {
                        nextHead.y = nextY;
                    }
                    break;
                }
                case WEST: {
                    const nextX = nextHead.x - 1;
                    if (nextX < 0) {
                        nextHead.x = this.board.W - 1;
                    }
                    else {
                        nextHead.x = nextX;
                    }
                    break;
                }
            }
            ;
            this.state.tail.forEach((tailPart) => {
                const { x, y } = tailPart;
                this.board.setAtXY(x, y, cell_states_5.CellStates.BLANK);
            });
            let nextTail = [...this.state.tail];
            nextTail.unshift(Object.assign({}, this.state.head));
            nextTail = nextTail.slice(0, this.state.tailLength);
            nextTail.forEach((tailPart) => {
                const { x, y } = tailPart;
                this.board.setAtXY(x, y, cell_states_5.CellStates.TAIL);
            });
            const { x: nextX, y: nextY } = nextHead;
            const nextCellState = this.board.getAtXY(nextX, nextY);
            switch (nextCellState) {
                case cell_states_5.CellStates.FOOD: {
                    this.timers.foodStart1 = time;
                    this.state.tailLength += 3;
                    break;
                }
                case cell_states_5.CellStates.BLANK: break;
                default: {
                    console.log('DEAD on ', nextCellState);
                    this.state.alive = false;
                    break;
                }
            }
            this.state.head = Object.assign({}, nextHead);
            this.state.tail = [...nextTail];
            this.board.setAtXY(nextHead.x, nextHead.y, cell_states_5.CellStates.HEAD);
            update(nextCellState, nextHead.x, nextHead.y);
            return this.state.alive;
        }
    }
    exports.SnakePlayer = SnakePlayer;
    ;
});
define("lib/ui-controls/board-select", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     *
     */
    exports.createBoardSelect = (options, selected) => {
        const select = document.createElement("select");
        select.setAttribute('name', 'boar-select');
        select.setAttribute('id', 'boar-select');
        options.forEach((opt) => {
            const option = document.createElement(`option`);
            option.setAttribute('value', opt);
            option.innerText = opt;
            if (selected === opt) {
                option.setAttribute('selected', opt);
            }
            select.appendChild(option);
        });
        return select;
    };
});
define("game/src/main", ["require", "exports", "lib/utils", "game/src/loose", "boards/src/index", "game/src/snake", "boards/src/cell-states", "lib/ui-controls/board-select", "boards/src/one-dim-board"], function (require, exports, utils_2, loose_1, index_1, snake_1, cell_states_6, board_select_1, one_dim_board_11) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.run = (ctxSnake, ctxBoard, board, onDie) => {
        const targetFPS = 60;
        const frameDuration = 1 / targetFPS * 1000;
        let lastFrameTime = 0;
        let frame = 0;
        let fpsHist = [];
        let running = false;
        let reqAnimationID = 0;
        const snake = new snake_1.SnakePlayer(ctxSnake, board);
        board.init(ctxBoard, 1);
        board.draw();
        snake.draw();
        const runToggle = (key) => {
            console.log('pause Req Id', reqAnimationID);
            if (key.key === ' ') {
                if (running) {
                    cancelAnimationFrame(reqAnimationID);
                }
                else {
                    reqAnimationID = requestAnimationFrame(loop1);
                }
                running = !running;
            }
        };
        document.addEventListener('keydown', snake.controls);
        document.addEventListener('keypress', runToggle);
        const stop = () => {
            document.removeEventListener('keydown', snake.controls);
            document.removeEventListener('keypress', runToggle);
            cancelAnimationFrame(reqAnimationID);
            running = false;
        };
        const loop1 = (time) => {
            const diff = time - lastFrameTime;
            if (diff <= frameDuration) {
                reqAnimationID = requestAnimationFrame(loop1);
                return;
            }
            frame++;
            //--
            const isAlive = snake.move(time, (nextCell, nextX, nextY) => {
                switch (nextCell) {
                    case cell_states_6.CellStates.FOOD:
                        let cid = utils_2.random(0, board.cellCount());
                        while (!board.isCellEmptyAtId(cid)) {
                            cid = utils_2.random(0, board.cellCount());
                        }
                        board.setAtId(cid, cell_states_6.CellStates.FOOD);
                        board.setAtXY(nextX, nextY, cell_states_6.CellStates.BLANK);
                        board.refresh();
                        utils_2.updateScore(snake.state.tailLength);
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
            utils_2.debug([
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
        };
        // do not start immediatly!
        if (running) {
            reqAnimationID = requestAnimationFrame(loop1);
        }
    };
    const selectBoard = localStorage.getItem('last-played') || 'blank';
    index_1.GameBoards.loadLocalStorage((serial) => {
        return one_dim_board_11.LoadBoard(serial, one_dim_board_11.SnakeBoard);
    });
    //--
    const select = board_select_1.createBoardSelect(index_1.GameBoards.list(), selectBoard);
    const selectC = document.getElementById('board-select');
    (_a = selectC) === null || _a === void 0 ? void 0 : _a.appendChild(select);
    //--
    let PlayBoard = index_1.GameBoards.get(selectBoard);
    const worldW = PlayBoard.W;
    const worldH = PlayBoard.H;
    const cellPx = PlayBoard.cellPx;
    const worldWpx = worldW * cellPx;
    const worldHpx = worldH * cellPx;
    const [snakeEl, contextSnake] = utils_2.getContext2d('canvas-snake', worldWpx, worldHpx);
    const [boardEl, contextBoard] = utils_2.getContext2d('canvas-board', worldWpx, worldHpx);
    if (contextSnake && contextBoard) {
        const startGame = (board) => {
            console.log('START GAME');
            exports.run(contextSnake, contextBoard, board, () => {
                loose_1.loose(contextSnake, board, () => {
                    startGame(PlayBoard);
                });
            });
        };
        startGame(PlayBoard);
        //--
        select.addEventListener('change', function () {
            PlayBoard = index_1.GameBoards.get(this.value);
            localStorage.setItem('last-played', this.value);
            startGame(PlayBoard);
            this.blur();
        });
        //--
    }
    else {
        console.error('Could not get a CanvasRenderingContext2D');
    }
});
