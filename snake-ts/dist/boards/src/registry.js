"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BoardRegistry = /** @class */ (function () {
    function BoardRegistry() {
        this.registry = {};
    }
    BoardRegistry.prototype.get = function (name) {
        return this.registry[name];
    };
    BoardRegistry.prototype.add = function (name, board) {
        this.registry[name] = board;
        // localStorage.setItem(name,board);
    };
    BoardRegistry.prototype.list = function () {
        return Object.keys(this.registry);
    };
    return BoardRegistry;
}());
exports.GameBoards = new BoardRegistry();
