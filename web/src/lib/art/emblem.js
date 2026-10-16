/* The emblem of Mathesis Stoicheion: a wax tablet, a stylus and a compass, the three things the word στοιχεῖον can mean.
 - Letters: the wax tablet children learned their letters on. The points are lettered Α Β Γ Δ Ε, as Euclid letters them.
 - The shadow: the stylus stands upright in the wax like a sundial's pointer, and its shadow is a στοιχεῖον.
 - The elements: on the wax, Euclid's first proposition, an equilateral triangle on a given line (Elements 1.1).
   The given line is the stylus's shadow.
 When it comes into view the figure is drawn slowly and calmly, in about four seconds: the tablet fades in, the stylus
 rises and its shadow reaches out along the given line, the compass swings the circle round Α, steps to Β and swings the
 second circle, and the two sides of the triangle are scratched in; the letters fade in as their points are reached.
 After that every light (the pointer, or each finger on a phone) casts its own shadows across it, which follow the
 lights gently. (Design B's calm copy: no sparks, no flashes, no springs.)
 mountEmblem(canvas, {still}) draws it and returns a function that stops it; components/EmblemMark.tsx is its small
 flat form for the header. Ported from the design sample (redesign/prototype/emblem/ in the project files).
 It is plain JavaScript, as the sample was; components/home/NameEmblem.tsx imports it in the browser only. */
/* eslint-disable */
let reduce=false;
const TAU=Math.PI*2,clamp=(v,a,b)=>v<a?a:v>b?b:v,seg=(t,a,b)=>clamp((t-a)/(b-a),0,1);
// a smooth ease in and out, from 0 to 1, with no overshoot
const ease=k=>k<=0?0:k>=1?1:.5-.5*Math.cos(Math.PI*k);
// the drawing's clock: its steps are timed on a 1.8-unit score, played out over about four seconds
const PACE=1.8/3.9;
// the world: the tablet lies on z=0; x to the right, y away from the viewer, z up
const EL=52*Math.PI/180,SN=Math.sin(EL),CS=Math.cos(EL);
const TW=300,TD=200,FR=19,TH=14,HS=140,LEG=118;
const R=50,A={x:-25,y:-18},B={x:A.x+R,y:A.y},G={x:A.x+R/2,y:A.y+R*Math.sqrt(3)/2},D={x:A.x-R,y:A.y},E={x:B.x+R,y:B.y};
const T={x:A.x,y:A.y,z:HS};                        // the stylus's tip
const L0={x:A.x-1.5*R,y:A.y,z:HS*2.5};             // the resting light: it puts the tip's shadow exactly on Β
const STYLES={
  stone:{frame:"#5a4029",frameLit:"#b8864f",frameDark:"#22170e",side:"#160f09",wax:"#140d08",waxLit:"#3a2616",groove:"rgba(0,0,0,.7)",
    line:"#efc27a",letter:"#efc27a",metal:"#a06b33",metalLit:"#f3c88c",metalDark:"#3e2712",shadow:"5,3,2",
    font:'"GFS Didot","EB Garamond",Georgia,serif'}
};

// one shared listener for every light: the mouse, and every finger at once (they keep counting while the page scrolls)
const LIGHTS=new Map();
function setL(id,x,y,on){let l=LIGHTS.get(id);if(!l){if(!on)return;l={x,y,tx:x,ty:y,w:0,tw:1};LIGHTS.set(id,l)}l.tx=x;l.ty=y;l.tw=on?1:0}
let listening=false;
function listen(){if(listening)return;listening=true;
  addEventListener("pointermove",e=>{if(e.pointerType==="mouse")setL("m",e.clientX,e.clientY,true)},{passive:true});
  document.addEventListener("mouseout",e=>{if(!e.relatedTarget)setL("m",0,0,false)});
  addEventListener("blur",()=>{const l=LIGHTS.get("m");if(l)l.tw=0});
  const tl=e=>{for(const t of e.changedTouches)setL("t"+t.identifier,t.clientX,t.clientY,e.type==="touchstart"||e.type==="touchmove")};
  ["touchstart","touchmove","touchend","touchcancel"].forEach(n=>addEventListener(n,tl,{passive:true}))}
function stepLights(dt){let busy=false;const a=1-Math.exp(-dt/.35),b=1-Math.exp(-dt/(.3));
  for(const [id,l] of LIGHTS){l.x+=(l.tx-l.x)*a;l.y+=(l.ty-l.y)*a;l.w+=(l.tw-l.w)*b;
    if(l.tw===0&&l.w<.01){LIGHTS.delete(id);continue}if(Math.abs(l.tx-l.x)>.3||Math.abs(l.ty-l.y)>.3||Math.abs(l.tw-l.w)>.01)busy=true}
  return busy}

export function mountEmblem(cv,opt={}){
  reduce=!!opt.still;listen();
  // the letters are in the site's own Didot (next/font gives it a name of its own, read here from the page's styles)
  const P={...(STYLES[opt.style]||STYLES.stone)},x=cv.getContext("2d");
  P.font=getComputedStyle(document.documentElement).getPropertyValue("--f-display").trim()||P.font;
  let W=0,H=0,k=1,ox=0,oy=0,dpr=1,t0=null,lastT=0,raf=0,visible=false,state=reduce?99:-1,dirty=true;
  const pr=(X,Y,Z=0)=>[ox+X*k,oy-(Y*SN+Z*CS)*k];
  function size(){const r=cv.getBoundingClientRect();dpr=Math.min(2,devicePixelRatio||1);const w=Math.round(r.width*dpr),h=Math.round(r.height*dpr);
    if(w!==cv.width||h!==cv.height){cv.width=w;cv.height=h}W=r.width;H=r.height;k=Math.min(W/330,H/205);ox=W/2;oy=H*.52;dirty=true}
  // a point on the plane under a screen position (where a light stands), and the shadow of a point from a light
  const unproj=(sx,sy)=>({x:(sx-ox)/k,y:(oy-sy)/k/SN});
  function shadowOf(p,L){const z=Math.min(L.z-1,p.z),f=L.z/(L.z-z);let sx=L.x+(p.x-L.x)*f,sy=L.y+(p.y-L.y)*f;
    const dx=sx-p.x,dy=sy-p.y,d=Math.hypot(dx,dy),mx=260;if(d>mx){sx=p.x+dx/d*mx;sy=p.y+dy/d*mx}return {x:sx,y:sy}}
  function lights(r){const out=[];let mw=0;
    for(const l of LIGHTS.values()){if(l.w<.01)continue;const p=unproj(l.x-r.left,l.y-r.top),far=Math.hypot(p.x,p.y*.8);
      const w=l.w*clamp(1.6-far/420,0,1);if(w<.01)continue;mw=Math.max(mw,w);out.push({x:p.x,y:p.y-30,z:230,w,sx:l.x-r.left,sy:l.y-r.top})}
    out.unshift({...L0,w:1-.55*mw,rest:true});return out}

  // ---- the tablet ----
  function poly(pts){x.beginPath();pts.forEach((p,i)=>{const q=pr(p[0],p[1],p[2]||0);i?x.lineTo(q[0],q[1]):x.moveTo(q[0],q[1])});x.closePath()}
  function tablet(Ls){const hw=TW/2,hd=TD/2,iw=hw-FR,id=hd-FR;
    // its shadow on the ledge, away from the resting light
    x.save();const c=pr(18,-6,-TH);x.translate(c[0],c[1]);x.scale(1,SN);const g=x.createRadialGradient(0,0,hw*k*.6,0,0,hw*k*1.15);
    g.addColorStop(0,`rgba(${P.shadow},.55)`);g.addColorStop(1,`rgba(${P.shadow},0)`);x.fillStyle=g;x.beginPath();x.arc(0,0,hw*k*1.15,0,TAU);x.fill();x.restore();
    // the near side of the board
    poly([[-hw,-hd,0],[hw,-hd,0],[hw,-hd,-TH],[-hw,-hd,-TH]]);x.fillStyle=P.side;x.fill();
    poly([[hw,-hd,0],[hw,hd,0],[hw,hd,-TH],[hw,-hd,-TH]]);x.fillStyle=P.frameDark;x.fill();
    // the frame: wood, lit by the lights
    poly([[-hw,-hd],[hw,-hd],[hw,hd],[-hw,hd]]);const fg=x.createLinearGradient(...pr(-hw,0),...pr(hw,0));fg.addColorStop(0,P.frame);fg.addColorStop(1,P.frameDark);x.fillStyle=fg;x.fill();
    x.save();poly([[-hw,-hd],[hw,-hd],[hw,hd],[-hw,hd]]);x.clip();glow(Ls,P.frameLit,.55,1);x.restore();
    // the grain of the wood, fine lines along the frame
    x.save();poly([[-hw,-hd],[hw,-hd],[hw,hd],[-hw,hd]]);x.clip();x.strokeStyle="rgba(0,0,0,.22)";x.lineWidth=.6;
    for(let i=0;i<22;i++){const yy=-hd+i*(TD/21);x.beginPath();for(let s=0;s<=12;s++){const xx=-hw+s*TW/12,q=pr(xx,yy+Math.sin(s*1.3+i*2.1)*2.4);s?x.lineTo(q[0],q[1]):x.moveTo(q[0],q[1])}x.stroke()}x.restore();
    // the rim's lit edge and the two holes for the cord that bound it to its pair
    poly([[-hw,-hd],[hw,-hd],[hw,hd],[-hw,hd]]);x.strokeStyle="rgba(255,220,170,.18)";x.lineWidth=1;x.stroke();
    for(const yy of [-38,38]){const q=pr(-hw+FR*.5,yy);x.fillStyle="#0a0705";x.beginPath();x.ellipse(q[0],q[1],2.6*k,2.6*k*SN,0,0,TAU);x.fill()}
    // the wax, sunk a little below the frame: its far inner wall shows
    poly([[-iw,id,0],[iw,id,0],[iw,id,-3],[-iw,id,-3]]);x.fillStyle="#0a0604";x.fill();
    poly([[-iw,-id,-3],[iw,-id,-3],[iw,id,-3],[-iw,id,-3]]);x.fillStyle=P.wax;x.fill();
    x.save();x.clip();glow(Ls,P.waxLit,.9,.9);
    // old marks smoothed over in the wax, faint
    x.strokeStyle="rgba(255,220,170,.035)";x.lineWidth=.8;for(let i=0;i<9;i++){const yy=-id+14+i*16;x.beginPath();x.moveTo(...pr(-iw+8,yy,-3));x.lineTo(...pr(iw-8,yy+3,-3));x.stroke()}
    x.restore();
    poly([[-iw,-id,-3],[iw,-id,-3],[iw,id,-3],[-iw,id,-3]]);x.strokeStyle="rgba(0,0,0,.6)";x.lineWidth=1.2;x.stroke();
    // the frame's inner edge catches the light along the near side and the left
    x.strokeStyle="rgba(255,214,160,.2)";x.lineWidth=1;x.beginPath();x.moveTo(...pr(-iw,id));x.lineTo(...pr(-iw,-id));x.lineTo(...pr(iw,-id));x.stroke()}
  // warm light pooling on the surface under each light
  function glow(Ls,col,amt,rad){x.globalCompositeOperation="lighter";
    for(const L of Ls){const foot=L.rest?{x:-120,y:10}:L,q=pr(foot.x,foot.y,0),rr=(L.rest?260:200)*k*rad;
      x.save();x.translate(q[0],q[1]);x.scale(1,SN);const g=x.createRadialGradient(0,0,0,0,0,rr);
      g.addColorStop(0,hexA(col,Math.min(1,(L.rest?.22:.7)*amt*L.w)));g.addColorStop(.45,hexA(col,Math.min(1,(L.rest?.1:.3)*amt*L.w)));g.addColorStop(1,hexA(col,0));x.fillStyle=g;x.beginPath();x.arc(0,0,rr,0,TAU);x.fill();x.restore()}
    x.globalCompositeOperation="source-over"}
  const hexA=(h,a)=>{const n=parseInt(h.slice(1),16);return `rgba(${n>>16},${n>>8&255},${n&255},${a.toFixed(3)})`};

  // ---- the figure, scratched into the wax ----
  function scratch(pts,amt){if(amt<=0)return;const n=Math.max(2,Math.ceil(pts.length*amt));
    const path=()=>{x.beginPath();for(let i=0;i<n;i++){const p=pts[i],q=pr(p.x,p.y,-3);i?x.lineTo(q[0],q[1]):x.moveTo(q[0],q[1])}};
    path();x.strokeStyle=P.groove;x.lineWidth=2.4;x.stroke();
    x.save();x.translate(-.5,-.6);path();x.strokeStyle=P.line;x.globalAlpha=.85;x.lineWidth=1.05;x.stroke();
    x.restore();x.globalAlpha=1}
  const circle=(c,a0)=>{const o=[];for(let i=0;i<=96;i++){const a=a0+i/96*TAU;o.push({x:c.x+R*Math.cos(a),y:c.y+R*Math.sin(a)})}return o};
  const line=(p,q)=>{const o=[];for(let i=0;i<=24;i++)o.push({x:p.x+(q.x-p.x)*i/24,y:p.y+(q.y-p.y)*i/24});return o};
  const C1=circle(A,0),C2=circle(B,0),AB=line(A,B),GA=line(G,A),GB=line(G,B);
  function letter(ch,p,dx,dy,a){if(a<=0)return;const q=pr(p.x+dx,p.y+dy,-3);x.save();x.globalAlpha*=a;x.translate(q[0],q[1]);x.scale(1,SN);
    x.font=`${(13*k).toFixed(1)}px ${P.font}`;x.textAlign="center";x.textBaseline="middle";x.fillStyle=P.groove;x.fillText(ch,.5,.7);x.fillStyle=P.letter;x.fillText(ch,0,0);x.restore()}

  // ---- the stylus and the compass, and their shadows ----
  function shade(p,q,w0,w1,a){const a0=pr(p.x,p.y,-3),b0=pr(q.x,q.y,-3),dx=b0[0]-a0[0],dy=b0[1]-a0[1],d=Math.hypot(dx,dy)||1,nx=-dy/d,ny=dx/d;
    // a soft shadow: darkest at the foot, wider and fainter towards its end
    for(const [m,al] of [[3.4,.16],[2,.3],[1.1,.55]]){const g=x.createLinearGradient(a0[0],a0[1],b0[0],b0[1]);
      g.addColorStop(0,`rgba(${P.shadow},${(a*al).toFixed(3)})`);g.addColorStop(1,`rgba(${P.shadow},${(a*al*.45).toFixed(3)})`);
      const u=w0*m*k*.5,v=w1*m*k*.5*1.5;x.beginPath();x.moveTo(a0[0]+nx*u,a0[1]+ny*u);x.lineTo(b0[0]+nx*v,b0[1]+ny*v);x.lineTo(b0[0]-nx*v,b0[1]-ny*v);x.lineTo(a0[0]-nx*u,a0[1]-ny*u);x.closePath();x.fillStyle=g;x.fill()}}
  function rod(p,q,w0,w1,litFromLeft,cols){const a0=pr(p.x,p.y,p.z),b0=pr(q.x,q.y,q.z),dx=b0[0]-a0[0],dy=b0[1]-a0[1],d=Math.hypot(dx,dy)||1,nx=-dy/d,ny=dx/d;
    const g=x.createLinearGradient(a0[0]-nx*w0*k,a0[1]-ny*w0*k,a0[0]+nx*w0*k,a0[1]+ny*w0*k);
    g.addColorStop(0,litFromLeft?cols[1]:cols[2]);g.addColorStop(.5,cols[0]);g.addColorStop(1,litFromLeft?cols[2]:cols[1]);
    x.beginPath();x.moveTo(a0[0]+nx*w0*k*.5,a0[1]+ny*w0*k*.5);x.lineTo(b0[0]+nx*w1*k*.5,b0[1]+ny*w1*k*.5);x.lineTo(b0[0]-nx*w1*k*.5,b0[1]-ny*w1*k*.5);x.lineTo(a0[0]-nx*w0*k*.5,a0[1]-ny*w0*k*.5);x.closePath();x.fillStyle=g;x.fill()}
  function lightSide(Ls,px){let s=0;for(const L of Ls)s+=(L.x<px?1:-1)*L.w;return s>=0}
  function stylus(Ls,grow){if(grow<=0)return;const h=HS*grow,top={x:A.x,y:A.y,z:h},cols=[P.metal,P.metalLit,P.metalDark],left=lightSide(Ls,A.x);
    rod({x:A.x,y:A.y,z:-3},{x:A.x,y:A.y,z:h-16*grow},1.2,3.2,left,cols);
    rod({x:A.x,y:A.y,z:h-16*grow},top,3.2,8.5,left,cols)}   // the flat end, for smoothing the wax
  function stylusShadow(Ls,grow){if(grow<=0)return;for(const L of Ls){const s=shadowOf({x:T.x,y:T.y,z:HS*grow},L),m=shadowOf({x:T.x,y:T.y,z:(HS-16)*grow},L);
    shade(A,m,1.4,3.4,L.w);shade(m,s,3.4,8,L.w)}}
  function compassAt(f1,f2,lift){const mx=(f1.x+f2.x)/2,my=(f1.y+f2.y)/2,half=Math.hypot(f2.x-f1.x,f2.y-f1.y)/2,hz=Math.sqrt(Math.max(1,LEG*LEG-half*half));
    return {f1:{...f1,z:lift-3},f2:{...f2,z:lift-3},h:{x:mx,y:my,z:hz+lift}}}
  function compass(Ls,c){const cols=[P.metal,P.metalLit,P.metalDark],left=lightSide(Ls,c.h.x);
    const back=c.f1.y>c.f2.y?c.f1:c.f2,front=back===c.f1?c.f2:c.f1;
    rod(back,c.h,1,4,left,[P.metalDark,P.metal,P.metalDark]);rod(front,c.h,1,4.4,left,cols);
    const q=pr(c.h.x,c.h.y,c.h.z);x.fillStyle=P.metalDark;x.beginPath();x.arc(q[0],q[1],4.2*k,0,TAU);x.fill();
    x.fillStyle=P.metalLit;x.beginPath();x.arc(q[0]-(left?1:-1)*1.2*k,q[1]-1.2*k,1.8*k,0,TAU);x.fill()}
  function compassShadow(Ls,c){for(const L of Ls){const hs=shadowOf(c.h,L),f1=c.f1.z>0?shadowOf(c.f1,L):c.f1,f2=c.f2.z>0?shadowOf(c.f2,L):c.f2;shade(f1,hs,1,4,L.w*.9);shade(f2,hs,1,4,L.w*.9)}}

  // the dark away from the lights: a layer of shadow with a hole of light under each one, laid over what is drawn
  let dk=null;function dark(Ls){if(!dk)dk=document.createElement("canvas");if(dk.width!==cv.width||dk.height!==cv.height){dk.width=cv.width;dk.height=cv.height}
    const d=dk.getContext("2d");d.setTransform(1,0,0,1,0,0);d.globalCompositeOperation="source-over";d.clearRect(0,0,dk.width,dk.height);
    d.fillStyle="rgba(4,2,1,.62)";d.fillRect(0,0,dk.width,dk.height);d.globalCompositeOperation="destination-out";d.setTransform(dpr,0,0,dpr,0,0);
    for(const L of Ls){const foot=L.rest?{x:-95,y:-5}:{x:L.x,y:L.y+30},q=pr(foot.x,foot.y,0),rr=(L.rest?300:230)*k;
      d.save();d.translate(q[0],q[1]);d.scale(1,.72);const g=d.createRadialGradient(0,0,0,0,0,rr);
      g.addColorStop(0,`rgba(0,0,0,${(.95*L.w).toFixed(3)})`);g.addColorStop(.5,`rgba(0,0,0,${(.55*L.w).toFixed(3)})`);g.addColorStop(1,"rgba(0,0,0,0)");d.fillStyle=g;d.beginPath();d.arc(0,0,rr,0,TAU);d.fill();d.restore()}
    x.save();x.setTransform(1,0,0,1,0,0);x.globalCompositeOperation="source-atop";x.drawImage(dk,0,0);x.restore()}

  // ---- one frame: the drawing of the figure runs on a clock once the emblem comes into view ----
  function draw(t,dt){const r=cv.getBoundingClientRect();x.setTransform(dpr,0,0,dpr,0,0);x.clearRect(0,0,W,H);
    const Ls=reduce?[{...L0,w:1,rest:true}]:lights(r);
    const s=state*PACE;   // where the drawing is on its score (state is the seconds since it came into view)
    const fade=ease(seg(s,0,.5)),lineK=ease(seg(s,.32,.5));
    const c1=ease(seg(s,.5,.95)),hop=seg(s,.95,1.12),c2=ease(seg(s,1.12,1.57)),tri=ease(seg(s,1.57,1.8));
    x.save();if(fade<1)x.globalAlpha=fade;
    tablet(Ls);
    // the figure
    scratch(AB,lineK);scratch(C1,c1);scratch(C2,c2);scratch(GA,tri);scratch(GB,tri);
    const ps=k2=>ease(k2);
    letter("Α",A,-7,-11,ps((s-.42)/.3));letter("Β",B,-2,-11,ps((s-.47)/.3));letter("Δ",D,-10,0,ps((s-.9)/.3));letter("Ε",E,10,0,ps((s-1.52)/.3));letter("Γ",G,0,9,ps((s-1.7)/.3));
    // the shadows, then the stylus and the compass standing over them
    const grow=ease(seg(s,.05,.4));
    // the compass: it swings the circle round Α, hops to Β, swings the circle round Β, and stands there
    let cA;if(s<.5)cA=compassAt(A,B,0);
    else if(hop<=0){const a=c1*TAU;cA=compassAt(A,{x:A.x+R*Math.cos(a),y:A.y+R*Math.sin(a)},0)}
    else if(c2<=0){const e=ease(hop),f1={x:A.x+(B.x-A.x)*e,y:A.y},f2={x:B.x+(E.x-B.x)*e,y:A.y};cA=compassAt(f1,f2,Math.sin(Math.PI*hop)*22)}
    else{const a=c2*TAU;cA=compassAt(B,{x:B.x+R*Math.cos(a),y:B.y+R*Math.sin(a)},0)}
    if(s>=1.57)cA=compassAt(B,E,0);
    const cIn=ease(seg(s,.3,.62));
    // the shadows fall on the board, and end at its edge
    x.save();poly([[-TW/2,-TD/2],[TW/2,-TD/2],[TW/2,TD/2],[-TW/2,TD/2]]);x.clip();stylusShadow(Ls,grow);if(cIn>0){x.globalAlpha*=clamp(cIn,0,1);compassShadow(Ls,cA)}x.restore();
    stylus(Ls,grow);if(cIn>0){x.save();x.globalAlpha*=clamp(cIn*1.4,0,1);compass(Ls,cA);x.restore()}
    x.restore();
    dark(Ls)}

  function tick(t){raf=0;const dt=lastT?Math.min(.05,(t-lastT)/1000):1/60;lastT=t;
    if(!visible){lastT=0;return}
    const r=cv.getBoundingClientRect(),vh=innerHeight;
    if(!reduce){if(state<0&&r.top<vh*.86&&r.bottom>vh*.1){state=0}else if(state>=0&&r.top>vh+20){state=-1;dirty=true}}
    let busy=stepLights(dt);if(state>=0&&state<2.1/PACE){state+=dt;busy=true}
    if(W!==r.width||H!==r.height)size();
    if(busy||dirty){dirty=false;if(state>=0||reduce)draw(t,dt);else{x.setTransform(1,0,0,1,0,0);x.clearRect(0,0,cv.width,cv.height)}}
    raf=requestAnimationFrame(tick)}
  const io=new IntersectionObserver(es=>{visible=es[0].isIntersecting;if(visible&&!raf){lastT=0;raf=requestAnimationFrame(tick)}},{rootMargin:"80px"});
  const onResize=()=>size();
  io.observe(cv);addEventListener("resize",onResize);size();
  if(reduce){state=99}
  return ()=>{io.disconnect();removeEventListener("resize",onResize);if(raf)cancelAnimationFrame(raf);raf=0;visible=false};
}
