export const PLAYER = { radius: .28, height: 3.9, eye: 3.7, floor: -2.67, walk: 3.4, sprint: 7, gravity: 18, jump: 8 };
const overlap=(p,b)=>p.x+PLAYER.radius>b.min.x&&p.x-PLAYER.radius<b.max.x&&p.z+PLAYER.radius>b.min.z&&p.z-PLAYER.radius<b.max.z;
export function movePlayer(state, movement, boxes, dt, jump=false){
  const p={...state}, step=Math.min(dt,.05);
  if(jump&&p.grounded){p.velocityY=PLAYER.jump;p.grounded=false;}
  const blocked=(x,z)=>Math.abs(x)>11||Math.abs(z)>10||boxes.some(b=>overlap({...p,x,z},b)&&p.feet<b.max.y-.025&&p.feet+PLAYER.height>b.min.y+.025);
  if(!blocked(p.x+movement.x,p.z))p.x+=movement.x;
  if(!blocked(p.x,p.z+movement.z))p.z+=movement.z;
  const previous=p.feet;p.velocityY-=PLAYER.gravity*step;p.feet+=p.velocityY*step;p.grounded=false;
  for(const b of boxes){if(!overlap(p,b))continue;if(p.velocityY<=0&&previous>=b.max.y-.03&&p.feet<=b.max.y){p.feet=b.max.y;p.velocityY=0;p.grounded=true;}else if(p.velocityY>0&&previous+PLAYER.height<=b.min.y+.03&&p.feet+PLAYER.height>=b.min.y){p.feet=b.min.y-PLAYER.height;p.velocityY=0;}}
  if(p.feet<=PLAYER.floor){p.feet=PLAYER.floor;p.velocityY=0;p.grounded=true;}
  return p;
}
