/**
 * Board states
 */

export type CellState = string;
export enum CellStates {
    BLANK = '0',
    HEAD = '@',
    TAIL = '=',
    FOOD = '3',
    POWER_FOOD = '4',
    POISON_FOOD = '5',
    WALL = '9',
};