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
define("lib/ui-controls/tool-bar", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createToolBar = (tools, selected, className) => {
        const wrapper = document.createElement('div');
        const classes = ['tool-bar'];
        if (className) {
            classes.push(className);
        }
        wrapper.setAttribute('class', classes.join(' '));
        const toolEls = tools.map((tool) => {
            const toolEl = document.createElement('div');
            toolEl.innerText = tool.label;
            if (tool.id === selected) {
                toolEl.setAttribute('class', 'tool tool-selected');
            }
            else {
                toolEl.setAttribute('class', 'tool');
            }
            toolEl.addEventListener('click', () => {
                tool.onSelect(tool.id, tool.label);
                toolEls.forEach((t) => {
                    let c = t.getAttribute('class') || '';
                    const newClass = c.replace(/ ?tool-selected/, '');
                    t.setAttribute('class', newClass);
                });
                let classes = (toolEl.getAttribute('class') || '').split(' ').filter((c) => c.length > 0);
                classes.push('tool-selected');
                toolEl.setAttribute('class', classes.join(' '));
            });
            wrapper.append(toolEl);
            return toolEl;
        });
        return wrapper;
    };
});
// <div>Tools: </div>
// <div>🍏Food </div>
// <div>🧱Wall </div>
/**
 * Board Editor
 */
define("board-editor/src/main", ["require", "exports", "lib/utils", "boards/src/index", "boards/src/cell-states", "lib/ui-controls/board-select", "lib/ui-controls/tool-bar", "boards/src/one-dim-board"], function (require, exports, utils_2, index_1, cell_states_4, board_select_1, tool_bar_1, one_dim_board_11) {
    "use strict";
    var _a, _b, _c, _d;
    Object.defineProperty(exports, "__esModule", { value: true });
    //--
    index_1.GameBoards.loadLocalStorage((serial) => {
        return one_dim_board_11.LoadBoard(serial, one_dim_board_11.SnakeBoard);
    });
    const opts = index_1.GameBoards.list();
    const selectedBoard = localStorage.getItem('last-played') || 'blank';
    let currentTool = cell_states_4.CellStates.WALL;
    //--
    // const sideBar = document.getElementById('side-bar');
    const toolsEl = document.getElementById('tools');
    const toolBar = tool_bar_1.createToolBar([
        { id: 'food', label: '🍏Food', onSelect: () => { currentTool = cell_states_4.CellStates.FOOD; } },
        { id: 'wall', label: '🧱Wall', onSelect: () => { currentTool = cell_states_4.CellStates.WALL; } }
    ], 'wall');
    (_a = toolsEl) === null || _a === void 0 ? void 0 : _a.append(toolBar);
    const select = board_select_1.createBoardSelect(opts, selectedBoard);
    (_b = toolsEl) === null || _b === void 0 ? void 0 : _b.prepend(select);
    const saveButton = document.createElement('button');
    saveButton.innerText = 'Save';
    (_c = toolsEl) === null || _c === void 0 ? void 0 : _c.prepend(saveButton);
    const newButton = document.createElement('button');
    newButton.innerText = 'New';
    (_d = toolsEl) === null || _d === void 0 ? void 0 : _d.prepend(newButton);
    //--
    let PlayBoard = index_1.GameBoards.get(selectedBoard);
    const worldW = PlayBoard.W;
    const worldH = PlayBoard.H;
    const cellPx = PlayBoard.cellPx;
    const worldWpx = worldW * cellPx;
    const worldHpx = worldH * cellPx;
    const boardNameEl = document.getElementById('board-name');
    if (boardNameEl) {
        boardNameEl.innerText = selectedBoard;
    }
    const [canvasEl, contextBoard] = utils_2.getContext2d('canvas-board', worldWpx, worldHpx);
    const [canvasElDraw, contextBoardDraw] = utils_2.getContext2d('canvas-board-draw', worldWpx, worldHpx);
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
            PlayBoard = index_1.GameBoards.get(this.value);
            PlayBoard.init(contextBoard);
            PlayBoard.draw();
            localStorage.setItem('last-played', this.value);
            this.blur();
        });
        saveButton.addEventListener('click', function () {
            const namePrompt = prompt('Enter Boar name', name);
            const newName = namePrompt ? namePrompt : name;
            index_1.GameBoards.save(newName, PlayBoard);
            this.blur();
        });
        newButton.addEventListener('click', function () {
            const sure = confirm('Are you sure?');
            if (sure) {
                PlayBoard = index_1.newBlank();
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
                PlayBoard.setAtXY(cellX, cellY, cell_states_4.CellStates.WALL);
            }
            if (e.ctrlKey) {
                PlayBoard.setAtXY(cellX, cellY, cell_states_4.CellStates.BLANK);
            }
            requestAnimationFrame(() => {
                PlayBoard.draw();
                contextBoardDraw.clearRect(0, 0, worldWpx, worldHpx);
                contextBoardDraw.fillStyle = 'red';
                contextBoardDraw.fillRect(cx, cy, PlayBoard.cellPx, PlayBoard.cellPx);
                contextBoardDraw.stroke();
            });
        };
        document.addEventListener('keypress', (key) => {
            switch (key.key) {
                case ' ':
                    PlayBoard.setAtXY(cellX, cellY, currentTool);
                    PlayBoard.draw();
                    break;
                case 'c':
                    PlayBoard.setAtXY(cellX, cellY, cell_states_4.CellStates.BLANK);
                    PlayBoard.draw();
                    break;
                default:
                    break;
            }
        });
        document.addEventListener('keyup', () => {
            console.log(PlayBoard.serialize());
            index_1.GameBoards.save('draft', PlayBoard);
        });
    }
});
