
import { Board } from "./index";

const Blank: Board = {
    W: 50,
    H: 30,
    cells: (new Array(50 * 30)).fill(0, 50 * 30),
}

export default Blank;
