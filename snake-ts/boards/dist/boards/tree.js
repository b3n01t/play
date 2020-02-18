define(["require", "exports", "../one-dim-board"], function (require, exports, one_dim_board_1) {
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
    const Cells = BoardTxt.replace(/\n/g, '').replace(/ /g, '0').split('').map((c) => {
        const int = parseInt(c, 10);
        return int;
    });
    exports.Tree = new one_dim_board_1.SnakeBoard(Width, Height, cellPx, Cells);
});
//# sourceMappingURL=tree.js.map