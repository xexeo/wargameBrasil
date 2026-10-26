import type {CombatEvent} from './engine.js';

/** Presentation only: keeps transient shots outside game state and never delays an action. */
export function createCombatEffects(map:SVGElement,announcement:HTMLElement,describe:(event:CombatEvent)=>{label:string;announcement:string}) {
 const duration=650,queue:CombatEvent[]=[];
 let current:CombatEvent|null=null,last:CombatEvent|null=null,started=0,timer:ReturnType<typeof setTimeout>|undefined;
 const center=({q,r}:{q:number;r:number})=>({x:65+q*64+r*32,y:63+r*56});
 function redraw(){
  map.querySelector('.combat-effect')?.remove();
  announcement.textContent=last?describe(last).announcement:'';
  if(!current)return;
  const from=center(current.from),to=center(current.to),{label}=describe(current),delay=-Math.max(0,performance.now()-started);
  const group=document.createElementNS('http://www.w3.org/2000/svg','g');
  group.setAttribute('class','combat-effect');group.setAttribute('pointer-events','none');group.setAttribute('aria-hidden','true');
  group.dataset.combatKind=current.kind;group.dataset.from=`${current.from.q},${current.from.r}`;group.dataset.to=`${current.to.q},${current.to.r}`;
  group.dataset.damage=String(current.damage);group.style.setProperty('--combat-delay',`${delay}ms`);
  const width=Math.max(130,Math.min(420,label.length*9+24)),labelX=Math.max(width/2+5,Math.min(955-width/2,to.x)),labelY=Math.max(26,to.y-42);
  group.innerHTML=`<defs><marker id="combat-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10Z" fill="#981b2a"/></marker></defs><path class="combat-trace-halo" d="M${from.x} ${from.y}L${to.x} ${to.y}"/><path class="combat-trace" d="M${from.x} ${from.y}L${to.x} ${to.y}" marker-end="url(#combat-arrow)"/><circle class="combat-muzzle" cx="${from.x}" cy="${from.y}" r="10"/><g class="combat-impact" transform="translate(${to.x} ${to.y})"><circle class="combat-impact-ring" r="28"/><path class="combat-burst" d="M0 -29L7 -13L23 -23L14 -7L31 0L14 7L23 23L7 14L0 31L-7 14L-23 23L-14 7L-31 0L-14 -7L-23 -23L-7 -14Z"/><circle class="combat-impact-center" r="9"/></g><g class="combat-label"><rect x="${labelX-width/2}" y="${labelY-22}" width="${width}" height="31" rx="5"/><text x="${labelX}" y="${labelY}" text-anchor="middle"></text></g>`;
  group.querySelector('text')!.textContent=label;
  if(!current.damage)group.classList.add('combat-miss');
  map.appendChild(group);
 }
 function next(){
  current=queue.shift()??null;timer=undefined;
  if(!current){redraw();return;}
  started=performance.now();last=current;
  redraw();timer=setTimeout(next,duration);
 }
 function enqueue(event:CombatEvent){queue.push(event);if(!current)next();}
 function clear(){if(timer!==undefined)clearTimeout(timer);timer=undefined;queue.length=0;current=null;last=null;announcement.textContent='';redraw();}
 return {enqueue,redraw,clear};
}
