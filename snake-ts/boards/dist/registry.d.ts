import { OneDimBoard } from "./one-dim-board";
declare class BoardRegistry {
    private registry;
    constructor();
    get(name: string): OneDimBoard;
    add(name: string, board: OneDimBoard): void;
    list(): string[];
}
export declare const GameBoards: BoardRegistry;
export {};
//# sourceMappingURL=registry.d.ts.map