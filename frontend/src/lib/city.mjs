export const CITY_LIMIT = 108;
export const buildings = [];
const random = n => { const v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
for(let x=-3;x<=3;x++) for(let z=-3;z<=3;z++) {
  const i=(x+3)*7+z+3;
  buildings.push({x:x*30+15,z:z*30+15,w:15+random(i+1)*5,d:15+random(i+8)*5,h:12+random(i+12)*48,tone:i%3});
}
export function blocked(x,z,r=.38,y=0) {
  return Math.abs(x)>CITY_LIMIT-r || Math.abs(z)>CITY_LIMIT-r || buildings.some(b=>y<b.h && Math.abs(x-b.x)<b.w/2+r && Math.abs(z-b.z)<b.d/2+r);
}
export function stepPlayer(p,input,dt) {
  dt=Math.min(dt,.04);
  const speed=input.sprint?8:3.8, length=Math.hypot(input.x,input.z)||1;
  const response=1-Math.exp(-12*dt);
  p.vx+=(input.x/length*speed-p.vx)*response;p.vz+=(input.z/length*speed-p.vz)*response;
  if(input.jump&&p.y<=0){p.vy=7;p.y=.001;}
  p.vy-=20*dt;p.y=Math.max(0,p.y+p.vy*dt);if(p.y===0)p.vy=0;
  const x=p.x+p.vx*dt,z=p.z+p.vz*dt;
  if(!blocked(x,p.z,.38,p.y))p.x=x;else p.vx=0;
  if(!blocked(p.x,z,.38,p.y))p.z=z;else p.vz=0;
  return p;
}
