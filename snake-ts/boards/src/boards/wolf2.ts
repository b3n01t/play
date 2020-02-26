import { SnakeBoard } from '../one-dim-board';
//--
const Width = 50;
const Height = 30;
const cellPx = 15;

const BoardTxt =`
                                                  
                                                  
                                                  
                                                  
                  3                               
                                                  
                                                  
                                                  
                                                  
                                                  
                                  3               
                                                  
                                                  
                                                  
9999999999999999999999                            
999999 999 9999999999                             
              9                                   
99            9 9                   3             
999           9999                                
 9999         99 99                               
  9999       99 9 9                               
    9999999999    99999                           
     999999999    9 9 9                           
    99999999999  9 9 99                           
    999999999999999999                            
   9999999999999                                  
   999999999999                                   
   9 999999 99                                    
   9 9 9 99 9                                     
999999999999999999999999999                       
`;

const Cells = BoardTxt.replace(/\n/g,'').replace(/ /g,'0').split('');

export const Wolf2 = new SnakeBoard(Width, Height, cellPx, Cells);
