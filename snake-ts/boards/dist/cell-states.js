/**
 * Board states
 */
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CellState;
    (function (CellState) {
        CellState[CellState["BLANK"] = 0] = "BLANK";
        CellState[CellState["HEAD"] = 1] = "HEAD";
        CellState[CellState["TAIL"] = 2] = "TAIL";
        CellState[CellState["FOOD"] = 3] = "FOOD";
        CellState[CellState["POWER_FOOD"] = 4] = "POWER_FOOD";
        CellState[CellState["POISON_FOOD"] = 5] = "POISON_FOOD";
        CellState[CellState["WALL"] = 9] = "WALL";
    })(CellState = exports.CellState || (exports.CellState = {}));
    ;
});
//# sourceMappingURL=cell-states.js.map