define(["require", "exports", "../one-dim-board", "../cell-states"], function (require, exports, one_dim_board_1, cell_states_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //--
    const Width = 50;
    const Height = 30;
    const cellPx = 15;
    const l = Width * Height;
    const Cells = new Array(l);
    Cells.fill(cell_states_1.CellState.BLANK, 0, l);
    console.log(Cells);
    //--
    exports.BlankBoard = new one_dim_board_1.SnakeBoard(Width, Height, cellPx, Cells);
});
//# sourceMappingURL=blank.js.map