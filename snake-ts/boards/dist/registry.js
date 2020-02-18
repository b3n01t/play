define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class BoardRegistry {
        constructor() {
            this.registry = {};
        }
        get(name) {
            return this.registry[name];
        }
        add(name, board) {
            this.registry[name] = board;
            // localStorage.setItem(name,board);
        }
        list() {
            return Object.keys(this.registry);
        }
    }
    exports.GameBoards = new BoardRegistry();
});
//# sourceMappingURL=registry.js.map