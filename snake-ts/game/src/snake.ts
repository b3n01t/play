import { Board } from "../../boards/src/one-dim-board";
import { CellStates, CellState } from "../../boards/src/cell-states";

const NORTH = 0;
const EAST = 1;
const SOUTH = 2;
const WEST = 3;

export class SnakePlayer {

    public state = {
        alive: true,
        direction: WEST,
        speed: 6, // cell per sec
        lastTick: 0,
        tailLength: 3,
        head: { x: 35, y: 15 },
        tail: [{ x: 36, y: 15 }, { x: 37, y: 15 }, { x: 38, y: 15 }] as Array<{ x: number, y: number }>,
    };

    private timers = {
        foodStart1: 0
    };

    constructor(
        public ctx: CanvasRenderingContext2D,
        public board: Board
    ) {
        this.controls = this.controls.bind(this);
    }

    public controls(key: KeyboardEvent) {
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
            case 'ArrowRight': this.state.direction = EAST; break;
            case 'ArrowUp': this.state.direction = NORTH; break;
            case 'ArrowLeft': this.state.direction = WEST; break;
            case 'ArrowDown': this.state.direction = SOUTH; break;
            case '=': this.state.speed += 1; break;
            case '-': this.state.speed -= 1; break;
            default: break;
        }
    }

    public draw(time?: number) {
        this.ctx.save();
        const t = time ? time : 0;
        const c = this.ctx;
        c.shadowBlur = 2;
        c.clearRect(0, 0, this.board.cellPx * this.board.W, this.board.cellPx * this.board.H)
        c.shadowColor = c.fillStyle = 'red';
        c.fillRect(
            this.state.head.x * this.board.cellPx,
            this.state.head.y * this.board.cellPx,
            this.board.cellPx,
            this.board.cellPx
        );
        c.fillStyle = 'black';
        this.state.tail.forEach((tailPart, tailIdx) => {
            // if (this.state.tail.length !== this.state.tailLength) {
            if (this.timers.foodStart1 > 0 && (t - this.timers.foodStart1 < 2000)) {
                // Growing!
                const hue = Math.sin(tailIdx + 2 * 3.314159 * 1 / 10000 * t) * 360;
                const lighness = Math.sin(tailIdx + 2 * 3.314159 * t) + 60;
                c.shadowColor = c.fillStyle = `hsl(${hue},100%, ${lighness}%)`;
                c.shadowBlur = 12;
                c.fillRect(
                    tailPart.x * this.board.cellPx + 1 + Math.sin(3.314159 / 3 * t),
                    tailPart.y * this.board.cellPx + 1 + Math.sin(3.314159 / 3 * t),
                    this.board.cellPx - 2 - Math.sin(3.314159 / 3 * t),
                    this.board.cellPx - 2 - Math.sin(3.314159 / 3 * t)
                );
            } else {
                c.shadowBlur = 0;
                c.fillRect(
                    tailPart.x * this.board.cellPx + 1,
                    tailPart.y * this.board.cellPx + 1,
                    this.board.cellPx - 2,
                    this.board.cellPx - 2
                );
            }
        });
        this.ctx.restore();
    }

    public move(time: number, update: (cell: CellState, x: number, y: number) => void) {
        if (time) {
            const delta = time - this.state.lastTick;
            if (delta < 1 / this.state.speed * 1000) {
                return this.state.alive;
            }
            this.state.lastTick = time;
        }

        const nextHead = { ...this.state.head };
        switch (this.state.direction) {
            case NORTH: {
                const nextY = nextHead.y - 1;
                if (nextY < 0) {
                    nextHead.y = this.board.H - 1;
                } else {
                    nextHead.y = nextY; break;
                }
                break;
            }
            case EAST: {
                const nextX = nextHead.x + 1;
                if (nextX >= this.board.W) {
                    nextHead.x = 0;
                } else {
                    nextHead.x = nextX;
                }
                break;
            }
            case SOUTH: {
                const nextY = nextHead.y + 1;
                if (nextY >= this.board.H) {
                    nextHead.y = 0;
                } else {
                    nextHead.y = nextY;
                }
                break;
            }
            case WEST: {
                const nextX = nextHead.x - 1;
                if (nextX < 0) {
                    nextHead.x = this.board.W - 1;
                } else {
                    nextHead.x = nextX;
                }
                break;
            }
        };

        this.state.tail.forEach((tailPart) => {
            const { x, y } = tailPart;
            this.board.setAtXY(x, y, CellStates.BLANK);
        });

        let nextTail = [...this.state.tail];
        nextTail.unshift({ ...this.state.head });
        nextTail = nextTail.slice(0, this.state.tailLength);

        nextTail.forEach((tailPart) => {
            const { x, y } = tailPart;
            this.board.setAtXY(x, y, CellStates.TAIL);
        });

        const { x: nextX, y: nextY } = nextHead;
        const nextCellState = this.board.getAtXY(nextX, nextY)
        switch (nextCellState) {
            case CellStates.FOOD: {
                this.timers.foodStart1 = time;
                this.state.tailLength += 3;
                break;
            }
            case CellStates.BLANK: break;
            default: {
                console.log('DEAD on ', nextCellState);
                this.state.alive = false;
                break;
            }
        }

        this.state.head = { ...nextHead };
        this.state.tail = [...nextTail];
        this.board.setAtXY(nextHead.x, nextHead.y, CellStates.HEAD);
        update(nextCellState, nextHead.x, nextHead.y);
        return this.state.alive;
    }

};
