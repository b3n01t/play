import { SnakeBoard } from '../one-dim-board';
import { CellState } from '../cell-states';
//--
const Width = 50 ;
const Height = 30 ;
const cellPx = 15;

const Cells: Array<CellState> = `
9999999999999999999999                            
999999 999 9999999999                             
  99          9                                   
99            9 9                                 
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
                                                  
                                 3                
                                                  
                                                  
                                                  
                                                  
                                                  
                                                  
           3                                      
                                                  
                                                  
                                                  
                                                  
                                                  
`.replace(/\n/g, '').replace(/ /g, '0').split('');

export const Wolf = new SnakeBoard(Width, Height, cellPx, Cells);
