import {operationResult,objectives,canCaptureObjective,type Game} from './engine.js';

// Report the final board, without interpreting an empty summit as never occupied.
export function operationPresentation(game:Game){
 const result=operationResult(game);
 if(game.winner!=='br'||!(game.victoryReason==='elimination'||!game.units.some(u=>u.side==='de')))return result;
 const peak=objectives[0],present=game.units.filter(u=>u.side==='br'&&u.q===peak.q&&u.r===peak.r);
 const state=present.some(canCaptureObjective)
  ? 'No encerramento, o cume está ocupado pela infantaria brasileira.'
  : present.length
   ? 'No encerramento, há apoio brasileiro no cume; apoio não assegura objetivos.'
   : 'No encerramento, o cume está sem peça brasileira.';
 return {...result,detail:`Não restam peças alemãs em combate. A vitória foi por neutralização da força adversária. ${state} Peças fora de combate não equivalem a todos os soldados mortos.`};
}
