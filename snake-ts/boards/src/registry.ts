import { OneDimBoard } from "./one-dim-board";

class BoardRegistry {
    private registry: {
        [name: string]: OneDimBoard
    } = {};
    constructor() { }

    get(name: string) {
        if (this.registry[name] === undefined) {
            throw new Error(`Board ${name} does not not exist`);
        }
        return this.registry[name];
    }

    add(name: string, board: OneDimBoard) {
        this.registry[name] = board;
    }

    save(name: string, board: OneDimBoard) {
        this.add(name, board);
        localStorage.setItem(`SB-${name}`, board.serialize(name));
        console.log('Saved!', `SB-${name}`);
    }

    list() {
        return Object.keys(this.registry).sort();
    }

    loadLocalStorage(loader: (serial: string) => OneDimBoard) {
        Object.keys(localStorage).forEach((key) => {
            if (key.startsWith('SB-')) {
                console.log(key);
                const serial = localStorage.getItem(key);
                if (serial) {
                    const board: OneDimBoard = loader(serial);
                    // const board: OneDimBoard = LoadBoard(serial, SnakeBoard);
                    const boardName = key.replace('SB-', '');
                    this.add(boardName, board);
                }
            }
        });
    }
}




export const GameBoards = new BoardRegistry();
