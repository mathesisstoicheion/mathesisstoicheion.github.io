/* Design A, "Gold and lamplight": the drawing and moving parts of the design sample, as it was shown and chosen.
 The owner, 2026-10-19: "Just take the template of the original gold and lamplight design and don't make any changes to
 speed or anything." So this is the sample's own script (redesign/design-a/design-a.html in the project files, round 11),
 with as few changes as possible. What changed, and why:
 - It was one page with three screens; here each page of the site registers the parts it shows (its windows, the
   library's stage, the floating letters, the Muses' lamps, the reader's cover) and takes them away when it closes.
 - Its pictures and the Apology were inlined; here they are files (public/images/a/, public/data/a/apology.txt).
 - Its typefaces were named directly; here they are read from the site's font variables, since the site serves them itself.
 - The owner's three animation levels (2026-10-19: "One with the full beauty and intricate design and animation. One with
   a few visual sacrifices for better performance, and a full performance mode"): Full beauty is the sample exactly;
   Balanced draws at the sample's own sharpness only while something moves and otherwise at half the frame rate, with
   fewer floating letters and dust motes; Performance is the sample's own "reduce motion" path (everything drawn once,
   holding still), which the sample already had.
 - The wheel's settling at the nearest section can be switched off (the owner, 2026-10-16: "no snapping").
 It is plain JavaScript, as the sample was, and runs in the browser only (components/a/ import it there). */
/* eslint-disable */
let reduce=false,lite=false;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
let seed=11;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;

/* ---------- colours and faces, read once per page, never per frame ---------- */
let T={},F={};
const cssv=n=>getComputedStyle(document.documentElement).getPropertyValue(n).trim();
function readTokens(){T={red:cssv("--red"),gold:cssv("--gold"),goldHi:cssv("--gold-hi"),amber:cssv("--amber"),amberHi:cssv("--amber-hi"),room:cssv("--room")};
  F={gentium:cssv("--font-gentium")||'"Gentium Book Plus",serif',display:cssv("--font-display")||'"Noto Serif Display",serif',mono:cssv("--font-mono")||'"Noto Sans Mono",monospace'}}

/* ---------- the Apology (Burnet's Oxford text, via Perseus): the library's Socrates and the Socrates emblems ---------- */
let APO="",APO_CAPS=null,SOC_CHARS=null,apoP=null;
const GL="αβγδεζηθικλμνξοπρστυφχψωΑΒΓΔΘΛΞΠΣΦΨΩ";
const RAMP=" ··˙ιιτνυοσρκεαγδζλβξθφψωΦΘΨΩ";
const CAPS="ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ";
function loadApology(){return apoP||(apoP=fetch("/data/a/apology.txt").then(r=>r.ok?r.text():"").catch(()=>"").then(t=>{APO=t.trim();
  SOC_CHARS=[...new Set(APO+GL+CAPS)].filter(c=>c!==" ");return APO}))}
// the speech as Greek was written in Plato's time: capitals, with no spaces or accents
const apoCaps=()=>APO_CAPS||(APO_CAPS=APO.normalize("NFD").replace(/[̀-̈́͆-ͯ]/g,"").toUpperCase().replace(/[^Α-Ω]/g,""));

/* ---------- pointer (viewport coordinates) ---------- */
/* The pointer, and fingers. With a mouse there is one pointer. On a phone every finger counts, all the time, even while
   it scrolls the page: the browser stops sending pointer events once a scroll begins, but touch events keep coming. */
const P={x:-999,y:-999,on:false,down:false,mouse:false,lx:null,ly:null,vx:0,vy:0};   // the mouse, or else the first finger
const FING=new Map();   // fingers on the glass now, and ones just lifted (they fade out)
let PTS=[];             // what touches the art this frame: {x,y,vx,vy,w (0 to 1, for fading),held,id}
let busyT=0;            // the last moment something moved (Balanced draws at full rate only then)
const isMouse=e=>e.pointerType==="mouse";
function onTouches(e){const now=performance.now(),seen=new Set();busyT=now;
  for(const t of e.touches){let f=FING.get(t.identifier);
    if(!f||f.up){f={id:t.identifier,x:t.clientX,y:t.clientY,x0:t.clientX,y0:t.clientY,t0:now,lx:t.clientX,ly:t.clientY,vx:0,vy:0,w:0,up:0,moved:0};FING.set(t.identifier,f)}
    f.x=t.clientX;f.y=t.clientY;f.moved=Math.max(f.moved,Math.hypot(f.x-f.x0,f.y-f.y0));seen.add(t.identifier)}
  for(const f of FING.values())if(!seen.has(f.id)&&!f.up)f.up=now;
  const first=[...FING.values()].find(f=>!f.up);if(first){P.x=first.x;P.y=first.y;P.on=true;P.down=true}else P.down=false;Engine.kick()}
// once a frame: each point's speed, the lifted fingers fading out, and the list the art reads
function tickPoints(dt){const now=performance.now(),q=Math.max(dt,.008),out=[];
  if(P.mouse&&P.on){P.vx=P.lx===null?0:(P.x-P.lx)/q;P.vy=P.ly===null?0:(P.y-P.ly)/q;P.lx=P.x;P.ly=P.y;out.push({x:P.x,y:P.y,vx:P.vx,vy:P.vy,w:1,held:P.down,id:"m"})}else{P.lx=P.ly=null}
  for(const f of FING.values()){f.vx=(f.x-f.lx)/q;f.vy=(f.y-f.ly)/q;f.lx=f.x;f.ly=f.y;
    if(f.up){f.w=Math.max(0,f.w-dt/.7);if(f.w<=0){FING.delete(f.id);continue}}else f.w=Math.min(1,f.w+dt*5);
    // a finger "holds" once it has rested in one place for a moment (that is what opens the reading glass)
    out.push({x:f.x,y:f.y,vx:f.up?0:f.vx,vy:f.up?0:f.vy,w:f.w,held:!f.up&&now-f.t0>350&&f.moved<14,id:f.id})}
  PTS=out.slice(0,5)}

/* ---------- shared drawing helpers ---------- */
function loadImg(src){return new Promise(r=>{const i=new Image();i.onload=()=>r(i);i.onerror=()=>r(null);i.src=src})}
function sample(img,w,h){const c=document.createElement("canvas");c.width=w;c.height=h;const x=c.getContext("2d",{willReadFrequently:true});x.drawImage(img,0,0,w,h);return x.getImageData(0,0,w,h).data}
/* a text set in lines of n letters, broken only between words */
function wrapText(s,n){const out=[];let line="";
  for(const w of s.split(" ")){if(!line)line=w;else if(line.length+1+w.length<=n)line+=" "+w;else{out.push(line.padEnd(n));line=w}
    while(line.length>n){out.push(line.slice(0,n));line=line.slice(n)}}
  if(line)out.push(line.padEnd(n));return out}
const dprCap=()=>lite?1:1.5;

/* Scene: the coin, engraved in gold on Pompeian red, laid out in viewport space */
function CoinScene(img){
  const sw=180,sh=Math.round(sw*img.height/img.width);const d=sample(img,sw,sh);
  const lum=new Float32Array(sw*sh),mask=new Float32Array(sw*sh);for(let i=0;i<sw*sh;i++){lum[i]=d[i*4]/255;mask[i]=d[i*4+3]/255}
  const rays=[];for(let b=0;b<16;b++){const a=b/16*Math.PI*2+rnd()*.2;const n=6+(rnd()*9|0);for(let k=0;k<n;k++)rays.push({a:a+(k-n/2)*.011,r0:.36+rnd()*.06,r1:.62+rnd()*.5})}
  for(let k=0;k<180;k++)rays.push({a:k/180*Math.PI*2,r0:.4,r1:.48+rnd()*.06});
  const at=(u,v)=>{const i=clamp(u*sw|0,0,sw-1),j=clamp(v*sh|0,0,sh-1);return j*sw+i};
  return {draw(x,vw,vh,view,t,prog,mode,ptr,an){
    const red=T.red,gold=T.gold,hi=T.goldHi;
    x.fillStyle=red;x.fillRect(view.x,view.y,view.w,view.h);
    // engraved ground: fine diagonal hatching
    x.strokeStyle="rgba(0,0,0,.22)";x.lineWidth=.6;x.beginPath();
    const hs=7,start=Math.floor((view.x+view.y)/hs)*hs;for(let k=start;k<view.x+view.y+view.w+view.h+hs;k+=hs){x.moveTo(k-view.y,view.y);x.lineTo(k-view.y-view.h,view.y+view.h)}x.stroke();
    const scale=mode==="scrub"?.8+.4*prog:1;   // ("iris": the phone windows, see Engine.iris)
    const cx=an?an.cx:vw*(vw>860?.62:.5),cy=an?an.cy:vh*.5,S=(an?Math.min(an.w*1.2,an.h*1.05):Math.min(vw,vh)*.8)*scale;
    const rot=(reduce?0:t*.03)+(mode==="scrub"?prog*1.6:0);
    x.strokeStyle=hi;x.lineWidth=.7;x.globalAlpha=.5;x.beginPath();
    for(const r of rays){const a=r.a+rot;x.moveTo(cx+Math.cos(a)*S*r.r0,cy+Math.sin(a)*S*r.r0);x.lineTo(cx+Math.cos(a)*S*r.r1*.62,cy+Math.sin(a)*S*r.r1*.62)}
    x.stroke();x.globalAlpha=1;
    const bw=S*.72,bh=bw*sh/sw,bx=cx-bw/2,by=cy-bh/2,gap=Math.max(3.4,bw/96),step=2.4,R=Math.max(90,bw*.2);
    const reveal=mode==="scrub"?clamp(prog*2.4,0,1):mode==="iris"?(reduce?1:clamp(prog/.42,0,1)):(reduce?1:clamp(t/1.8,0,1));
    x.fillStyle=gold;
    const y0=Math.max(by+gap/2,view.y-gap),y1=Math.min(by+bh,view.y+view.h+gap);
    const xa=Math.max(bx,view.x-4),xb=Math.min(bx+bw,view.x+view.w+4);if(xb<=xa)return;
    for(let y=by+gap/2;y<y1;y+=gap){if(y<y0)continue;const v=(y-by)/bh,top=[],bot=[];const xEnd=Math.min(xb,bx+bw*clamp(reveal*1.25-v*.25,0,1));
      for(let xx=xa;xx<=xEnd;xx+=step){const k=at((xx-bx)/bw,v);let yy=y;
        if(!reduce){yy+=Math.sin(xx*.02+t*.8)*.35;for(const pp of ptr){const dx=xx-pp.x,dy=y-pp.y,dd=Math.hypot(dx,dy);if(dd<R){const q=Math.pow(1-dd/R,2)*pp.w;yy+=dy/(dd||1)*q*12}}}
        const th=mask[k]<.5?0:(.08+.92*Math.pow(lum[k],1.15))*gap*.92;top.push(xx,yy-th/2);bot.push(xx,yy+th/2)}
      if(top.length<4)continue;x.beginPath();x.moveTo(top[0],top[1]);for(let i=2;i<top.length;i+=2)x.lineTo(top[i],top[i+1]);for(let i=bot.length-2;i>=0;i-=2)x.lineTo(bot[i],bot[i+1]);x.closePath();x.fill()}
  }};
}

/* Scene: any other picture, engraved in the same gold lines on Pompeian red, shown whole inside its window. */
function PicScene(img,o){
  const sw=Math.min(img.width,320),sh=Math.round(sw*img.height/img.width);const d=sample(img,sw,sh);
  const lum=new Float32Array(sw*sh),mask=new Float32Array(sw*sh);for(let i=0;i<sw*sh;i++){lum[i]=d[i*4]/255;mask[i]=d[i*4+3]/255}
  const at=(u,v)=>{const i=clamp(u*sw|0,0,sw-1),j=clamp(v*sh|0,0,sh-1);return j*sw+i},asp=sw/sh;
  return {draw(x,vw,vh,view,t,prog,mode,ptr,an){
    x.fillStyle=T.red;x.fillRect(view.x,view.y,view.w,view.h);
    x.strokeStyle="rgba(0,0,0,.22)";x.lineWidth=.6;x.beginPath();
    const hs=7,start=Math.floor((view.x+view.y)/hs)*hs;for(let k=start;k<view.x+view.y+view.w+view.h+hs;k+=hs){x.moveTo(k-view.y,view.y);x.lineTo(k-view.y-view.h,view.y+view.h)}x.stroke();
    const bh=Math.min(an.h*.9,an.w*.9/asp),bw=bh*asp;   // the whole object, with a margin of red around it
    const bx=an.cx-bw/2,by=an.cy-bh/2,gap=clamp(Math.min(an.w,an.h)/58,3.1,5.2),step=2.2,R=Math.max(90,Math.min(bw,bh)*.3);
    const reveal=mode==="iris"?(reduce?1:clamp(prog/.42,0,1)):1;
    x.fillStyle=T.gold;
    const y1=Math.min(by+bh,view.y+view.h+gap),xa=Math.max(bx,view.x-4),xb=Math.min(bx+bw,view.x+view.w+4);if(xb<=xa)return;
    for(let y=Math.max(by,view.y-gap)+gap/2;y<y1;y+=gap){const v=(y-by)/bh,top=[],bot=[];const xEnd=Math.min(xb,xa+(xb-xa)*clamp(reveal*1.25-v*.25,0,1));
      for(let xx=xa;xx<=xEnd;xx+=step){const k=at((xx-bx)/bw,v);let yy=y;
        if(!reduce){yy+=Math.sin(xx*.02+t*.8)*.35;for(const pp of ptr){const dx=xx-pp.x,dy=y-pp.y,dd=Math.hypot(dx,dy);if(dd<R){const q=Math.pow(1-dd/R,2)*pp.w;yy+=dy/(dd||1)*q*10}}}
        const m=mask[k],th=m<.04?0:(.05+.8*Math.pow(lum[k],1.35))*gap*Math.min(1,m*1.3);top.push(xx,yy-th/2);bot.push(xx,yy+th/2)}
      if(top.length<4)continue;x.beginPath();x.moveTo(top[0],top[1]);for(let i=2;i<top.length;i+=2)x.lineTo(top[i],top[i+1]);for(let i=bot.length-2;i>=0;i-=2)x.lineTo(bot[i],bot[i+1]);x.closePath();x.fill()}
  }};
}

/* Glyph atlas: each letter is drawn once, large, in each style; scenes then stamp the letters with drawImage,
   which costs far less than drawing text thousands of times a frame. Drawn large so the lens can enlarge them crisply. */
function Atlas(chars,styles,px){
  const OS=Math.min(2,devicePixelRatio||1)*2.4,F0=px*OS,cw=Math.ceil(F0*1.3),ch=Math.ceil(F0*1.7);
  const total=chars.length*styles.length,per=Math.ceil(Math.sqrt(total*ch/cw));
  const cv=document.createElement("canvas");cv.width=per*cw;cv.height=Math.ceil(total/per)*ch;
  const x=cv.getContext("2d");x.textAlign="center";x.textBaseline="alphabetic";
  const idx=styles.map(()=>new Map());let n=0;
  styles.forEach((s,si)=>{x.font=`${s.w} ${(F0*s.s).toFixed(1)}px ${F.gentium}`;x.fillStyle=s.c;
    for(const c of chars){const sx=(n%per)*cw,sy=(n/per|0)*ch;x.fillText(c,sx+cw/2,sy+ch*.7);idx[si].set(c,[sx,sy]);n++}});
  return {cv,idx,cw,ch,OS,base:.7}
}

/* Scene: Socrates spelled out of Plato's Apology, in a dark room lit by one lamp.
   Every letter is the speech in reading order; only their brightness draws the face.
   With a pointer, the lamp is also a reading glass that enlarges the letters under it.
   On the Stage the still face is kept in a picture of its own and redrawn only when the text or the gathering moves. */
function SocScene(img){
  let lay=null,cache=null,ck="",cT=0;
  function layout(vw,vh,an){const key=[vw,vh,an?[an.cx|0,an.cy|0,an.w|0,an.h|0]:0,T.amber].join();if(lay&&lay.key===key)return lay;
    const asp=img.width/img.height,wide=vw>=1100;let boxH=an?an.h*.98:vh*.9,boxW=boxH*asp;const maxW=an?an.w*.98:vw*(wide?.44:.92);if(boxW>maxW){boxW=maxW;boxH=boxW/asp}
    const cx=an?an.cx:vw*(wide?.745:.5),cy=an?an.cy:vh/2,bx=cx-boxW/2,by=cy-boxH/2;   // on a wide screen the face has the right of the page to itself
    const cols=clamp(Math.round(boxW/6.2),44,96),cw=boxW/cols,ch=cw*1.26,rows=Math.floor(boxH/ch);
    const d=sample(img,cols,rows),N=cols*rows,G=new Float32Array(N),fly=[];
    for(let k=0;k<N;k++)G[k]=(.3*d[k*4]+.59*d[k*4+1]+.11*d[k*4+2])/255;
    // sharpen the features against their surroundings (eyes, brow, nose and beard), then stretch the head's tones to full range
    const Bl=new Float32Array(N),rad=Math.max(2,Math.round(cols/22));
    for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){let sum=0,c=0;for(let v=Math.max(0,j-rad);v<=Math.min(rows-1,j+rad);v++)for(let u=Math.max(0,i-rad);u<=Math.min(cols-1,i+rad);u++){sum+=G[v*cols+u];c++}Bl[j*cols+i]=sum/c}
    for(let k=0;k<N;k++)G[k]=G[k]<.1?G[k]:clamp(G[k]+1.1*(G[k]-Bl[k]),0,1);
    const lit=[...G].filter(v=>v>.12).sort((a,b)=>a-b),lo=lit[Math.floor(lit.length*.04)]||.1,hi=lit[Math.floor(lit.length*.98)]||1;
    for(let k=0;k<N;k++){const v=clamp((G[k]-lo)/(hi-lo),0,1);G[k]=Math.pow(v,1.25);
      // each loose letter wanders slowly round a resting place of its own until the scroll calls it home
      fly.push({at:((k/cols|0)/rows)*.8+rnd()*.5,sx:rnd()*vw,sy:rnd()*vh,sub:rnd()<.38,w1:.03+rnd()*.07,w2:.025+rnd()*.06,ph:rnd()*6.3,amp:30+rnd()*70,c:SOC_CHARS[(rnd()*SOC_CHARS.length)|0]})}
    const glow=document.createElement("canvas");glow.width=cols;glow.height=rows;{const gx=glow.getContext("2d"),gi=gx.createImageData(cols,rows),[R0,G0,B0]=[255,150,60];
      for(let k=0;k<N;k++){gi.data[k*4]=R0;gi.data[k*4+1]=G0;gi.data[k*4+2]=B0;gi.data[k*4+3]=G[k]*255}gx.putImageData(gi,0,0)}
    // further down the page the face falls apart, and some of its letters rearrange into a papyrus roll: the speech in
    // capitals, in columns, between two rolled ends, as a book was in Plato's time
    const rW=Math.min(an?an.w*.98:vw*(wide?.46:.94),boxW*1.18),C2=Math.max(30,Math.floor(rW/cw)),R2=Math.max(14,Math.round(C2*cw*.56/ch));
    const rx=cx-C2*cw/2,ry=cy-R2*ch/2,rl=Math.max(3,Math.round(C2*.075)),top=1,bot=R2-2,t0=rl+2,t1=C2-rl-2;
    const ncol=t1-t0>=40?3:2,gapc=Math.max(2,Math.round((t1-t0)*.07)),cc=Math.floor((t1-t0-gapc*(ncol-1))/ncol);
    const CAPS_=apoCaps(),slots=[],G2=new Float32Array(C2*R2),put=(gx,l,g,c)=>{slots.push({x:rx+(gx+.5)*cw,y:ry+l*ch+ch*.86,g,c:c||CAPS[(gx*7+l*13)%24]});G2[l*C2+gx]=g};
    let ci=0;for(let c=0;c<ncol;c++)for(let l=top+2;l<=bot-2;l++)for(let i=0;i<cc;i++)put(t0+c*(cc+gapc)+i,l,.48+.14*rnd(),CAPS_[ci++%CAPS_.length]);
    const nText=slots.length;
    for(const l of[top,bot])for(let gx=rl;gx<C2-rl;gx++)put(gx,l,.3,null);   // the sheet's top and bottom edges
    for(const side of[0,1])for(let l=0;l<R2;l++)for(let i=0;i<rl;i++){const u=(i+.5)/rl,sh=Math.pow(Math.sin(Math.PI*u),.7)*(side?.82+.18*u:1-.18*u);   // the rolled ends, shaded like cylinders
      put(side?C2-rl+i:i,l,(.14+.78*sh)*(l===0||l===R2-1?.55:1),null)}
    for(let s2=0;s2<slots.length;s2++){const k=Math.floor((s2+.5)*N/slots.length);fly[k].sl=s2}
    fly.forEach((fl,k)=>{fl.d=.3*((k/cols|0)/rows)+.6*rnd();fl.fx=(rnd()-.5)*70;fl.fy=50+rnd()*120;if(fl.sl===undefined)fl.sl=-1});   // the crown lets go first
    const glow2=document.createElement("canvas");glow2.width=C2;glow2.height=R2;{const gx=glow2.getContext("2d"),gi=gx.createImageData(C2,R2);
      for(let k=0;k<C2*R2;k++){gi.data[k*4]=255;gi.data[k*4+1]=150;gi.data[k*4+2]=60;gi.data[k*4+3]=G2[k]*255}gx.putImageData(gi,0,0)}
    const roll={C2,R2,rx,ry,slots,nText,glow:glow2,soft:softGlow(glow2)};
    const fpx=cw*1.24,A=Atlas(SOC_CHARS,[{w:400,s:.84,c:T.amber},{w:400,s:1.04,c:T.amber},{w:700,s:1.2,c:T.amberHi}],fpx);
    ck="";return lay={key,cols,rows,cw,ch,bx,by,cx,cy,boxW,boxH,G,fly,A,glow,soft:softGlow(glow),roll,gw:A.cw/A.OS,gh:A.ch/A.OS,lines:wrapText(APO,cols)}}
  function softGlow(src){const c=document.createElement("canvas");c.width=src.width*4;c.height=src.height*4;const g=c.getContext("2d");g.imageSmoothingEnabled=true;g.filter="blur(6px)";g.drawImage(src,0,0,c.width,c.height);return c}
  // the roll, standing still (and, with a lens, enlarged under the reading glass)
  function paintRoll(x,L,lens){const A=L.A,R=L.roll,M=lens?lens.m:1;
    if(!lens){x.globalAlpha=.09;x.imageSmoothingEnabled=true;x.drawImage(R.soft,R.rx,R.ry,R.C2*L.cw,R.R2*L.ch)}
    for(const sl of R.slots){let px=sl.x,py=sl.y,sc=1;
      if(lens){const dx=px-lens.x,dy=py-lens.y;if(dx*dx+dy*dy>(lens.r/M)**2)continue;px=lens.x+dx*M;py=lens.y+dy*M;sc=M}
      const c=sl.c,p=A.idx[sl.g<.3?0:sl.g<.6?1:2].get(c);if(!p)continue;
      const w=L.gw*sc,h=L.gh*sc;x.globalAlpha=Math.min(1,lens?.3+.8*sl.g:.03+1.1*sl.g);x.drawImage(A.cv,p[0],p[1],A.cw,A.ch,px-w/2,py-h*A.base,w,h)}
    x.globalAlpha=1}
  // between the two: each letter falls a little, then glides to its place on the roll; the rest fall and fade into the dark
  function paintMorph(x,L,t,off,m){const A=L.A,R=L.roll,o0=Math.floor(off),fr=off-o0,n=L.lines.length,C=L.cols,gw=L.gw,gh=L.gh,drop=L.ch*.86;
    x.imageSmoothingEnabled=true;x.globalAlpha=.09*(1-m);x.drawImage(L.soft,L.bx,L.by,L.boxW,L.rows*L.ch);x.globalAlpha=.09*m;x.drawImage(R.soft,R.rx,R.ry,R.C2*L.cw,R.R2*L.ch);
    for(let j=0;j<L.rows;j++){const line=L.lines[(o0+j)%n],ty=L.by+(j-fr)*L.ch+drop,g0r=j*C;
      for(let i=0;i<C;i++){const fl=L.fly[g0r+i],k=clamp((m*1.55-fl.d)/.55,0,1),g0=L.G[g0r+i],a0=.03+1.1*g0;let s=line[i];
        const x0=L.bx+(i+.5)*L.cw;let px=x0,py=ty,a=a0,g=g0;
        if(fl.sl<0){if(a0<.1){a=a0*(1-clamp(m*5,0,1));if(a<.012||s===" ")continue}
          else{if(k>=1||s===" ")continue;const e=k*k;px+=fl.fx*.7*e;py+=fl.fy*1.5*e;a=a0*Math.pow(1-k,1.6)}}
        else{const sl=R.slots[fl.sl],e=k<.5?2*k*k:1-2*(1-k)*(1-k),cx=x0+fl.fx,cy=ty+fl.fy,u=1-e;
          px=u*u*x0+2*u*e*cx+e*e*sl.x;py=u*u*ty+2*u*e*cy+e*e*sl.y;g=g0+(sl.g-g0)*e;a=Math.max(.16,a0+(.03+1.1*sl.g-a0)*e);
          if(s===" "||k>.85)s=k>.85?sl.c:fl.c}
        if(a<.012)continue;const p=A.idx[g<.3?0:g<.6?1:2].get(s);if(!p)continue;
        x.globalAlpha=a>1?1:a;x.drawImage(A.cv,p[0],p[1],A.cw,A.ch,px-gw/2,py-gh*A.base,gw,gh)}}
    x.globalAlpha=1}
  // once the roll has formed, the same slow light reads its columns
  function idleRoll(x,L,t){const A=L.A,R=L.roll,p2=A.idx[2],i0=Math.floor(t*9)%R.nText;
    for(let k=Math.max(0,i0-44);k<=i0;k++){const sl=R.slots[k],p=p2.get(sl.c);if(!p)continue;const a=Math.exp(-(i0-k)/14),sc=1+.26*a,w=L.gw*sc,h=L.gh*sc;
      x.globalAlpha=Math.min(1,.25+.75*a);x.drawImage(A.cv,p[0],p[1],A.cw,A.ch,sl.x-w/2,sl.y-h*A.base,w,h)}
    const sl=R.slots[i0],g=x.createRadialGradient(sl.x,sl.y-L.ch*.4,0,sl.x,sl.y-L.ch*.4,L.ch*3.2);g.addColorStop(0,"rgba(255,190,110,.42)");g.addColorStop(1,"rgba(255,150,60,0)");
    x.globalAlpha=1;x.globalCompositeOperation="lighter";x.fillStyle=g;x.fillRect(sl.x-L.ch*3.2,sl.y-L.ch*3.6,L.ch*6.4,L.ch*6.4);x.globalCompositeOperation="source-over"}
  // stamp the letters of the face: off = how far the speech has risen (in lines), asm = how far the letters have gathered
  // part: "still" leaves out the letters still on their way, "move" draws only those (they are redrawn every frame)
  function paint(x,L,view,t,off,asm,lens,part){
    const A=L.A,o0=Math.floor(off),fr=off-o0,n=L.lines.length,C=L.cols,gw=L.gw,gh=L.gh,drop=L.ch*.86,done=asm>2.2;
    if(!lens&&asm>.9){x.globalAlpha=.09*clamp((asm-.9)/.9,0,1);x.imageSmoothingEnabled=true;x.drawImage(L.soft,L.bx,L.by,L.boxW,L.rows*L.ch);x.globalAlpha=1}
    const M=lens?lens.m:1,j0=lens?Math.floor((lens.y-lens.r/M-L.by)/L.ch+fr)-1:0,j1=lens?Math.ceil((lens.y+lens.r/M-L.by)/L.ch+fr)+1:L.rows;
    for(let j=Math.max(0,j0);j<=Math.min(L.rows,j1);j++){const gy=j-fr,ty=L.by+gy*L.ch,line=L.lines[(o0+j)%n];
      if(done&&!lens){if(ty>view.y+view.h)break;if(ty+L.ch<view.y)continue}
      const r0=clamp(Math.floor(gy),0,L.rows-1),r1=clamp(r0+1,0,L.rows-1),f=gy-Math.floor(gy),edge=j===0?1-fr:(j===L.rows?fr:1);
      for(let i=0;i<C;i++){let s=line[i];if(s===" ")continue;
        let px=L.bx+(i+.5)*L.cw,py=ty+drop,sc=1;const fl=L.fly[clamp(j,0,L.rows-1)*C+i];
        if(part){const moving=!lens&&fl.sub&&asm-fl.at<.6;if((part==="move")!==moving)continue}
        if(lens){const dx=px-lens.x,dy=py-lens.y;if(dx*dx+dy*dy>(lens.r/M)**2)continue;px=lens.x+dx*M;py=lens.y+dy*M;sc=M}
        const g=L.G[r0*C+i]*(1-f)+L.G[r1*C+i]*f;let a,k=1;
        if(lens)a=(.3+.7*g)*edge;
        else{k=clamp((asm-fl.at)/.6,0,1);a=(.03+1.1*g)*edge;
          if(k<1){if(fl.sub){const e=1-Math.pow(1-k,3),q=reduce?0:t,ox=fl.sx+Math.sin(q*fl.w1+fl.ph)*fl.amp,oy=fl.sy+Math.cos(q*fl.w2+fl.ph*1.3)*fl.amp*.7;
              px=ox+(px-ox)*e;py=oy+(py-oy)*e;if(k<.9)s=fl.c;a=Math.max(a,.26)*(.45+.55*k)}
            else{if(k<.6)continue;a*=(k-.6)/.4}}}
        if(a<.012)continue;
        if(px<view.x-gw*sc||px>view.x+view.w+gw*sc||py<view.y-gh*.3||py>view.y+view.h+gh*sc)continue;
        const p=L.A.idx[g<.3?0:g<.6?1:2].get(s);if(!p)continue;
        const w=gw*sc,h=gh*sc;x.globalAlpha=a>1?1:a;x.drawImage(A.cv,p[0],p[1],A.cw,A.ch,px-w/2,py-h*A.base,w,h)}}
    x.globalAlpha=1}
  // what moves while nobody scrolls, once he has gathered: a light that reads the speech slowly across his face
  function idle(x,L,t,off,asm,vw,vh){const A=L.A,gw=L.gw,gh=L.gh,p1=A.idx[1],p2=A.idx[2];
    if(asm>2.2){const C=L.cols,o0=Math.floor(off),fr=off-o0,n=L.lines.length,span=Math.max(1,L.rows-14),cp=t*9,j=7+Math.floor(cp/C)%span,i0=Math.floor(cp%C);
      const line=L.lines[(o0+j)%n],py=L.by+(j-fr)*L.ch+L.ch*.86;
      for(let k=Math.max(0,i0-44);k<=i0;k++){const s=line[k];if(!s||s===" ")continue;const p=p2.get(s);if(!p)continue;
        const a=Math.exp(-(i0-k)/14),sc=1+.26*a,w=gw*sc,h=gh*sc,px=L.bx+(k+.5)*L.cw;x.globalAlpha=Math.min(1,.25+.75*a);
        x.drawImage(A.cv,p[0],p[1],A.cw,A.ch,px-w/2,py-h*A.base,w,h)}
      const cx=L.bx+(i0+.5)*L.cw,g=x.createRadialGradient(cx,py-L.ch*.4,0,cx,py-L.ch*.4,L.ch*3.2);g.addColorStop(0,"rgba(255,190,110,.42)");g.addColorStop(1,"rgba(255,150,60,0)");
      x.globalAlpha=1;x.globalCompositeOperation="lighter";x.fillStyle=g;x.fillRect(cx-L.ch*3.2,py-L.ch*3.6,L.ch*6.4,L.ch*6.4);x.globalCompositeOperation="source-over"}
    // now and then a slow band of light passes across his face, as if someone carried a lamp by; it lights the face only, not the dark around it
    if(asm>1.2)band(x,L,t,L.glow,L.bx,L.by,L.boxW,L.rows*L.ch,clamp((asm-1.2)/1,0,1));
    x.globalAlpha=1}
  function band(x,L,t,src,X,Y,W,H,amt){const u=(t*.085)%1.6-.3,k=Math.sin(Math.PI*clamp((u+.3)/1.6,0,1))*amt;if(k<=.04)return;
    const bw=src.width,bh=src.height;if(!src.band){src.band=document.createElement("canvas");src.band.width=bw;src.band.height=bh}
    const b=src.band.getContext("2d"),c0=u*1.4-.2;b.globalCompositeOperation="source-over";b.clearRect(0,0,bw,bh);b.drawImage(src,0,0);
    b.globalCompositeOperation="destination-in";const sg=b.createLinearGradient((c0-.24)*bw,0,(c0+.24)*bw,0);sg.addColorStop(0,"rgba(0,0,0,0)");sg.addColorStop(.5,"rgba(0,0,0,1)");sg.addColorStop(1,"rgba(0,0,0,0)");
    b.fillStyle=sg;b.fillRect(0,0,bw,bh);x.globalCompositeOperation="lighter";x.globalAlpha=.3*k;x.imageSmoothingEnabled=true;x.drawImage(src.band,X,Y,W,H);x.globalCompositeOperation="source-over";x.globalAlpha=1}
  return {draw(x,vw,vh,view,t,prog,mode,ptr,an){
    const L=layout(vw,vh,an),scrub=mode==="scrub";
    let off=reduce?0:(scrub?prog*120+t*.1:t/2.8);
    // on the Stage his face gathers only as you scroll
    const asm=scrub?(reduce?9:prog*4.9):(reduce?9:t);   // gathered by the middle of the page
    const sm=k=>k*k*(3-2*k),m=scrub?(reduce?(prog>.7?1:0):sm(clamp((prog-.56)/.26,0,1))):0;   // then the face becomes the roll
    if(scrub){off=Math.round(off*4)/4;   // the speech rises in quarter lines, so the still face need not be redrawn every frame
      const dpr=Math.min(dprCap(),devicePixelRatio||1),k2=[L.key,off,asm>2.2?"d":asm.toFixed(3)].join(),now=performance.now();
      if(!cache){cache=document.createElement("canvas")}
      if(cache.width!==Math.round(vw*dpr)||cache.height!==Math.round(vh*dpr)){cache.width=Math.round(vw*dpr);cache.height=Math.round(vh*dpr);ck=""}
      if(m>0&&m<1){x.fillStyle=T.room;x.fillRect(0,0,vw,vh);paintMorph(x,L,t,off,m)}
      else{const k3=m>=1?L.key+"roll":k2;
        if(ck!==k3&&(now-cT>30||!ck)){const c=cache.getContext("2d");c.setTransform(dpr,0,0,dpr,0,0);c.fillStyle=T.room;c.fillRect(0,0,vw,vh);if(m>=1)paintRoll(c,L,null);else paint(c,L,{x:0,y:0,w:vw,h:vh},t,off,asm,null,"still");ck=k3;cT=now}
        x.drawImage(cache,0,0,vw,vh);
        if(m>=1){if(!reduce){idleRoll(x,L,t);band(x,L,t,L.roll.glow,L.roll.rx,L.roll.ry,L.roll.C2*L.cw,L.roll.R2*L.ch,1)}}
        else{if(!reduce&&asm<2.2)paint(x,L,{x:0,y:0,w:vw,h:vh},t,off,asm,null,"move");
          if(!reduce)idle(x,L,t,off,asm,vw,vh)}}}
    else{x.fillStyle=T.room;x.fillRect(view.x,view.y,view.w,view.h);paint(x,L,view,t,off,asm,null)}
    // the lamp: a warm glow under the pointer, or under each finger (and drifting by itself when nothing touches)
    const lamps=ptr.length?ptr:[{x:L.cx+L.boxW*.32*Math.sin(t*.33+prog*4),y:L.cy+L.boxH*.26*Math.cos(t*.27+prog*3),w:1}];
    const fk=reduce?1:.82+.1*Math.sin(t*9.7)+.08*Math.sin(t*23.3+1.1),R=Math.max(L.boxW,L.boxH)*.5*(lamps.length>1?.75:1);
    x.globalCompositeOperation="lighter";
    for(const lp of lamps){const a=.17*fk*lp.w/Math.sqrt(lamps.length),gr=x.createRadialGradient(lp.x,lp.y,0,lp.x,lp.y,R);gr.addColorStop(0,`rgba(255,150,60,${a.toFixed(3)})`);gr.addColorStop(.5,`rgba(255,120,40,${(a*.3).toFixed(3)})`);gr.addColorStop(1,"rgba(255,120,40,0)");
      x.fillStyle=gr;x.fillRect(Math.max(view.x,lp.x-R),Math.max(view.y,lp.y-R),2*R,2*R)}
    x.globalCompositeOperation="source-over";
    const hp=ptr.find(pp=>pp.held),lx=hp?hp.x:-9999,ly=hp?hp.y:-9999;
    // the reading glass: only while you press and hold on his face, and only once it has gathered
    const onRoll=m>=1,RL=L.roll,inBox=onRoll?lx>RL.rx-20&&lx<RL.rx+RL.C2*L.cw+20&&ly>RL.ry-20&&ly<RL.ry+RL.R2*L.ch+20:lx>L.bx-20&&lx<L.bx+L.boxW+20&&ly>L.by-20&&ly<L.by+L.boxH+20;
    if(hp&&!reduce&&asm>1.9&&(m<=0||m>=1)&&inBox){
      const r=clamp(L.boxW*.15,46,82);x.save();x.beginPath();x.arc(lx,ly,r,0,Math.PI*2);x.clip();
      x.fillStyle=T.room;x.globalAlpha=.94;x.fillRect(lx-r,ly-r,2*r,2*r);x.globalAlpha=1;
      if(onRoll)paintRoll(x,L,{x:lx,y:ly,r,m:2.3});else paint(x,L,view,t,off,9,{x:lx,y:ly,r,m:2.3});x.restore();
      x.strokeStyle=T.amber;x.globalAlpha=.45;x.lineWidth=1;x.beginPath();x.arc(lx,ly,r,0,Math.PI*2);x.stroke();x.globalAlpha=1}
  }};
}

/* ---------- scrolling on the home page and in the library ----------
   The wheel scrolls slowly and smoothly. A could also glide the page into place at the nearest section once you stopped
   (`settles`); the owner turned that down ("no snapping", 2026-10-16; "No settling", 2026-10-19), so the site never turns
   it on and the page stops where you stop. A phone keeps its own scrolling. None of this happens in the reader. */
const Glide={y:0,target:null,anim:null,raf:0,lt:0,tm:0,held:false,going:false,on_:false,settles:false,pts:()=>[],
  on(){return this.on_&&!reduce},
  max(){return Math.max(0,document.documentElement.scrollHeight-innerHeight)},
  points(){const M=this.max();return [0,M,...this.pts()].map(v=>clamp(v,0,M))},
  wheel(e){if(!this.on()||e.ctrlKey)return;if(e.target&&e.target.closest&&e.target.closest("[data-own-scroll]"))return;e.preventDefault();this.anim=null;
    const d=e.deltaMode===1?e.deltaY*32:e.deltaMode===2?e.deltaY*innerHeight:e.deltaY;
    if(this.target===null)this.y=this.target=scrollY;
    this.target=clamp(this.target+d*.6,0,this.max());this.run()},
  run(){if(!this.raf){if(!this.going)this.lt=performance.now();this.going=true;this.raf=requestAnimationFrame(t=>this.step(t))}},
  step(t){t=performance.now();const dt=Math.min(.05,Math.max(0,(t-this.lt)/1000));this.lt=t;this.raf=0;this.going=false;
    if(this.anim){const a=this.anim,k=clamp((t-a.t0)/a.d,0,1),e=k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2;scrollTo(0,a.from+(a.to-a.from)*e);if(k<1){this.going=true;this.run()}else this.anim=null;return}
    if(this.target===null)return;
    this.y+=(this.target-this.y)*(1-Math.exp(-dt*4.5));
    if(Math.abs(this.target-this.y)<.5){this.y=this.target;this.target=null;scrollTo(0,this.y);this.idle();return}
    scrollTo(0,this.y);this.going=true;this.run()},
  stop(){this.anim=null;this.target=null;clearTimeout(this.tm)},
  idle(){clearTimeout(this.tm);if(this.settles)this.tm=setTimeout(()=>this.settle(),170)},
  settle(){if(!this.on()||!this.settles||this.held||this.target!==null||this.anim||[...FING.values()].some(f=>!f.up))return;
    const y=scrollY,vh=innerHeight;let best=null;
    for(const p of this.points()){const d=Math.abs(p-y);if(d>2&&d<vh*.4&&(best===null||d<Math.abs(best-y)))best=p}
    if(best!==null){const dist=Math.abs(best-y);this.anim={from:y,to:best,t0:performance.now(),d:800+dist*1.6};this.run()}}
};

/* Headings settle as their section glides into place: their letters drift in from small offsets and find their places.
   Each heading's progress follows the scroll, so a slow glide plays it slowly. */
const Settle={items:[],
  add(el,words){if(reduce||el.dataset.settle)return()=>{};el.dataset.settle="1";const text=el.textContent;
    const parts=words?text.split(/(\s+)/):text.split(/(\s+)/).map(w=>/^\s+$/.test(w)?w:[...w]);let n=0;const total=words?parts.filter(w=>!/^\s+$/.test(w)).length:text.replace(/\s/g,"").length;
    const sp=c=>{const i=n++/Math.max(1,total-1),dx=((rnd()-.5)*(words?.5:.9)).toFixed(2),dy=((rnd()-.2)*(words?.7:1.1)).toFixed(2),r=((rnd()-.5)*(words?4:18)).toFixed(1);
      return `<span class="st-l" style="--i:${i.toFixed(3)};--dx:${dx}em;--dy:${dy}em;--r:${r}deg">${c}</span>`};
    const esc=c=>c.replace(/&/g,"&amp;").replace(/</g,"&lt;");
    const before=el.innerHTML;
    el.innerHTML=`<span class="st-sr">${esc(text)}</span><span aria-hidden="true">${parts.map(w=>typeof w==="string"?(/^\s+$/.test(w)?w:sp(esc(w))):`<span class="st-w">${w.map(c=>sp(esc(c))).join("")}</span>`).join("")}</span>`;
    const it={el,v:-1};this.items.push(it);Engine.kick();
    return()=>{this.items=this.items.filter(x=>x!==it);delete el.dataset.settle;el.innerHTML=before}},
  frame(vh){for(const it of this.items){const r=it.el.getBoundingClientRect();if(r.width<1)continue;if(r.bottom<-40||r.top>vh+40)continue;
    const v=Math.round(clamp((vh*.94-r.top)/(vh*.4),0,1)*200)/200;if(v!==it.v){it.v=v;it.el.style.setProperty("--sp",v)}}}
};

/* ---------- the engine: draws every visible window, the stage, the floating letters and the sparks ---------- */
const scenes=new Map();   // picture address -> scene (or a promise of one)
function sceneFor(src,kind){let s=scenes.get(src);if(s)return s instanceof Promise?null:s;
  const p=(kind==="soc"?Promise.all([loadImg(src),loadApology()]).then(([im])=>im):loadImg(src)).then(im=>{
    const sc=!im?null:kind==="coin"?CoinScene(im):kind==="soc"?(APO?SocScene(im):null):PicScene(im,{});
    if(sc)scenes.set(src,sc);else scenes.delete(src);Engine.kick();return sc});
  scenes.set(src,p);return null}
const wins=new Set();     // {el,cv,cap,src,kind}
let stage=null;           // {cv,src,span}
let flyCv=null,fireCv=null;
const flames=[];

const Engine={raf:0,t0:0,lt:0,lastDraw:0,introT0:0,live:false,
  start(){if(this.live||typeof window==="undefined")return;this.live=true;this.t0=performance.now();this.introT0=this.t0;readTokens();
    {const d=document.documentElement,lv=d.dataset.level||"full",m=d.dataset.motion;setLevel(lv,m==="reduce"||(m!=="full"&&matchMedia("(prefers-reduced-motion: reduce)").matches))}
    addEventListener("pointermove",e=>{if(!isMouse(e))return;P.mouse=true;P.x=e.clientX;P.y=e.clientY;P.on=true;busyT=performance.now();this.kick()},{passive:true});
    addEventListener("pointerdown",e=>{if(!isMouse(e))return;P.mouse=true;P.x=e.clientX;P.y=e.clientY;P.on=true;P.down=true;this.kick()},{passive:true});
    addEventListener("pointerup",e=>{if(isMouse(e))P.down=false},{passive:true});addEventListener("pointercancel",e=>{if(isMouse(e))P.down=false},{passive:true});
    document.documentElement.addEventListener("pointerleave",e=>{if(isMouse(e))P.on=false});
    for(const ev of["touchstart","touchmove","touchend","touchcancel"])addEventListener(ev,onTouches,{passive:true});
    addEventListener("wheel",e=>Glide.wheel(e),{passive:false});
    addEventListener("scroll",()=>{busyT=performance.now();if(!Glide.anim&&Glide.target===null)Glide.idle();this.kick()},{passive:true});
    addEventListener("touchstart",()=>Glide.stop(),{passive:true});addEventListener("touchend",()=>Glide.idle(),{passive:true});
    addEventListener("keydown",()=>{Glide.anim=null},{passive:true});
    addEventListener("mousedown",()=>{Glide.held=true;Glide.anim=null},{passive:true});addEventListener("mouseup",()=>{Glide.held=false;Glide.idle()},{passive:true});
    addEventListener("resize",()=>this.kick());
    document.addEventListener("visibilitychange",()=>this.kick())},
  /** a page has opened: its windows already in view open by themselves, slowly */
  opened(){this.introT0=performance.now();readTokens();this.kick()},
  any(){return wins.size>0||!!stage||!!flyCv||!!fireCv||flames.length>0||Settle.items.length>0},
  kick(){if(!this.raf&&this.live&&!document.hidden&&this.any())this.raf=requestAnimationFrame(t=>this.frame(t))},
  frame(t){this.raf=0;if(!this.any()||document.hidden){this.lt=0;return}
    const el=(t-this.t0)/1000,dt=this.lt?Math.min(.05,(t-this.lt)/1000):1/60,vw=innerWidth,vh=innerHeight;
    // Balanced: at half the frame rate while nothing moves (the slow ripple, the drifting lamp), at full rate while it does
    if(lite&&!reduce&&t-busyT>400&&FING.size===0&&t-this.lastDraw<31){this.raf=requestAnimationFrame(tt=>this.frame(tt));return}
    this.lastDraw=t;this.lt=t;tickPoints(dt);Settle.frame(vh);
    if(stage){const sc=sceneFor(stage.src,"soc");if(sc){const dpr=this.fitCanvas(stage.cv,vw,vh);const x=stage.cv.getContext("2d");x.setTransform(dpr,0,0,dpr,0,0);
      sc.draw(x,vw,vh,{x:0,y:0,w:vw,h:vh},el,clamp(scrollY/Math.max(1,stage.span()),0,1),"scrub",PTS)}}
    if(wins.size)this.iris(el,vw,vh);
    if(flyCv)this.letters(el,vw,vh);
    if(fireCv)Fire.frame(fireCv,el,dt,vw,vh);
    if(flames.length)drawFlames(el,dt,vh);
    if(!reduce)this.raf=requestAnimationFrame(tt=>this.frame(tt));
  },
  fitCanvas(cv,w,h){const dpr=Math.min(dprCap(),devicePixelRatio||1);const W=Math.round(w*dpr),H=Math.round(h*dpr);if(cv.width!==W||cv.height!==H){cv.width=W;cv.height=H}return dpr},
  // The windows open as a round iris centred on their picture: the coin, or another real object for each window.
  // It follows the scroll: it opens onto the middle of the picture alone, holds there with a thin gold rim, and then widens
  // to the whole window, while the engraving is cut. Windows in view when the page opens do the first part by themselves, slowly.
  iris(el,vw,vh){const intro=reduce?1:clamp((performance.now()-this.introT0)/1000-.4,0,3.4)/3.4;
    for(const w of wins){const r=w.el.getBoundingClientRect();if(r.bottom<0||r.top>vh||r.width<2)continue;
      const sc=sceneFor(w.src,w.kind);if(!sc)continue;
      const cv=w.cv;const dpr=this.fitCanvas(cv,r.width,r.height);const x=cv.getContext("2d");
      x.setTransform(dpr,0,0,dpr,0,0);x.clearRect(0,0,r.width,r.height);
      // it is fully open once the window's middle is a little above the screen's; a window near the foot of the page,
      // which can never rise that far, opens fully by the time the page ends
      const mid=r.top+r.height/2,left=Math.max(0,document.documentElement.scrollHeight-vh-scrollY),end=Math.max(vh*.44,mid-left),span=vh*.96-end;
      const sm0=k=>k*k*(3-2*k);let p=reduce||span<40?1:clamp((vh*.96-mid)/span,0,1);
      if(!reduce&&mid+scrollY<vh*.8)p=.62*sm0(intro)+.38*clamp(scrollY/(vh*.45),0,1);
      const an={cx:r.width/2,cy:r.height/2-(mid-vh/2)/vh*r.height*.08,w:r.width,h:r.height};
      const S=Math.min(an.w*1.2,an.h*1.05),Rc=S*.43,Rmax=Math.hypot(r.width/2,r.height/2+Math.abs(an.cy-r.height/2))+2;
      const sm=k=>k*k*(3-2*k),a=sm(clamp(p/.42,0,1)),b=sm(clamp((p-.68)/.32,0,1));
      const R=b>0?Rc+(Rmax-Rc)*b:Rc*a;
      const cap=w.cap;if(cap){const o=clamp((b-.65)/.35,0,1).toFixed(2);if(cap.style.opacity!==o)cap.style.opacity=o}
      if(R<1)continue;
      x.save();x.beginPath();x.arc(an.cx,an.cy,R,0,Math.PI*2);x.clip();
      sc.draw(x,r.width,r.height,{x:0,y:0,w:r.width,h:r.height},el,p,"iris",PTS.map(pp=>({x:pp.x-r.left,y:pp.y-r.top,w:pp.w})),an);
      x.restore();
      // the rim: a thin gold edge while the iris frames the coin, fading as it widens
      const rim=(1-b)*Math.min(1,a*1.4);if(rim>.01){
        const g=x.createRadialGradient(an.cx,an.cy,R,an.cx,an.cy,R+Math.max(10,R*.16));g.addColorStop(0,T.gold);g.addColorStop(1,"rgba(0,0,0,0)");
        x.globalAlpha=.16*rim;x.fillStyle=g;x.beginPath();x.arc(an.cx,an.cy,R+Math.max(10,R*.16),0,Math.PI*2);x.arc(an.cx,an.cy,R,0,Math.PI*2,true);x.fill();
        x.strokeStyle=T.goldHi;x.globalAlpha=.6*rim;x.lineWidth=1;x.beginPath();x.arc(an.cx,an.cy,R-.5,0,Math.PI*2);x.stroke();x.globalAlpha=1}
      // the window's frame line comes in once it is fully open
      if(b>.6){x.strokeStyle=T.gold;x.globalAlpha=.22*(b-.6)/.4;x.lineWidth=1;x.strokeRect(.5,.5,r.width-1,r.height-1);x.globalAlpha=1}}},
  // the flying letters behind the home page: few, faint and slow; they move at three speeds as you scroll, and step aside
  // from the pointer, catching a little of its light as they pass
  flyPts:null,
  letters(t,vw,vh){const cv=flyCv;const dpr=this.fitCanvas(cv,vw,vh);const x=cv.getContext("2d");x.setTransform(dpr,0,0,dpr,0,0);x.clearRect(0,0,vw,vh);
    const n=lite?60:120;if(!this.flyPts||this.flyPts.length!==n){this.flyPts=[];for(let k=0;k<n;k++){const z=k%3;this.flyPts.push({u:rnd(),v:rnd()*3,z,c:GL[(rnd()*GL.length)|0],ox:0,oy:0,p:rnd()*6,lit:0})}}
    x.fillStyle=T.gold;x.textBaseline="middle";x.textAlign="center";
    const SP=[.12,.3,.6],SZ=[10,14,21],AL=[.06,.1,.15],R=130;
    for(let z=0;z<3;z++){x.font=`${SZ[z]}px ${F.gentium}`;
      for(const d of this.flyPts){if(d.z!==z)continue;let px=d.u*vw,py=((d.v*vh-scrollY*SP[z])%(vh*3)+vh*3)%(vh*3)-vh*.5;
        if(py<-30||py>vh+30)continue;px+=Math.sin(t*.16+d.p)*6*(z+1);py+=Math.cos(t*.11+d.p)*3*(z+1);
        if(!reduce)for(const pp of PTS){const dx=px+d.ox-pp.x,dy=py+d.oy-pp.y,dd=Math.hypot(dx,dy);
          if(dd<R){const q=(1-dd/R)*pp.w;d.ox+=dx/(dd||1)*q*(.6+z*.5);d.oy+=dy/(dd||1)*q*(.6+z*.5);d.lit=Math.max(d.lit,q)}}
        d.ox*=.95;d.oy*=.95;d.lit*=.96;
        x.globalAlpha=Math.min(.5,AL[z]+.3*d.lit);x.fillText(d.c,px+d.ox,py+d.oy)}}
    x.globalAlpha=1},
};

/* ---------- fire: the sparks a fanned Muse's flame throws, behind the page ---------- */
const Fire={heat:0,pts:[],spr:null,lx:null,ly:null,ls:null,vx:0,vy:0,sp:0,sv:0,dirty:false,
  sprites(){this.spr=[[140,34,8],[255,112,30],[255,206,130]].map(([r,g,b])=>{const c=document.createElement("canvas");c.width=c.height=48;const x=c.getContext("2d");
    const gr=x.createRadialGradient(24,24,0,24,24,24);gr.addColorStop(0,`rgba(255,${Math.min(255,g+90)},${Math.min(255,b+110)},1)`);gr.addColorStop(.12,`rgba(${r},${g},${b},.95)`);
    gr.addColorStop(.32,`rgba(${r},${g},${b},.28)`);gr.addColorStop(1,`rgba(${r},${g},${b},0)`);x.fillStyle=gr;x.fillRect(0,0,48,48);return c})},
  // how hard the visitor is fanning: pointer speed and scroll speed both feed the heat
  fan(dt){let push=0;const q=Math.max(dt,.008);
    this.vx=this.vy=this.sp=0;for(const pp of PTS){const s2=Math.hypot(pp.vx,pp.vy);push+=Math.min(s2*q,220)*.0011*pp.w;if(s2>this.sp){this.sp=s2;this.vx=pp.vx;this.vy=pp.vy}}
    if(this.ls!==null){const ds=scrollY-this.ls;this.sv=ds/q;push+=Math.min(Math.abs(ds),500)*.0009}this.ls=scrollY;
    this.heat=Math.min(1.6,this.heat*Math.exp(-dt*.5)+push)},
  spawn(x,y,vx,vy,z,hot){if(this.pts.length<150)this.pts.push({x,y,vx,vy,z,age:0,life:2.2+Math.random()*3.8,s:.55+Math.random()*.9,p:Math.random()*6.3,glow:hot||0})},
  frame(cv,t,dt,vw,vh){
    if(!this.spr)this.sprites();
    const x=cv.getContext("2d");const W=Math.round(vw),H=Math.round(vh);if(cv.width!==W||cv.height!==H){cv.width=W;cv.height=H}
    this.fan(dt);const h1=0,heat=0;
    // nothing moves behind the page: this layer only carries the sparks a fanned Muse's flame throws
    if(!this.pts.length){if(this.dirty){x.clearRect(0,0,W,H);this.dirty=false}return}
    this.dirty=true;x.globalCompositeOperation="source-over";x.clearRect(0,0,W,H);
    if(reduce)return;
    const SP=[.12,.35,.7],ds=this.sv*dt||0,R=190;
    x.globalCompositeOperation="lighter";
    for(let k=this.pts.length-1;k>=0;k--){const e=this.pts[k];e.age+=dt;
      if(e.age>e.life||e.y<-40||e.x<-60||e.x>W+60){this.pts[k]=this.pts[this.pts.length-1];this.pts.pop();continue}
      e.vy-=(16+20*heat)*dt;e.vx*=Math.exp(-dt*.9);e.vy*=Math.exp(-dt*.3);
      e.vx+=Math.sin(t*1.7+e.p+e.y*.012)*(26+40*heat)*dt;
      for(const pp of PTS){const dx=e.x-pp.x,dy=e.y-pp.y,dd=Math.hypot(dx,dy);if(dd<R){const q=(1-dd/R)**2*pp.w;e.vx+=pp.vx*q*dt*2.4;e.vy+=pp.vy*q*dt*2.4;e.glow=Math.max(e.glow,q*Math.min(1,Math.hypot(pp.vx,pp.vy)/700))}}
      e.glow*=Math.exp(-dt*1.6);
      e.x+=e.vx*dt;e.y+=e.vy*dt-ds*SP[e.z];
      const life=Math.min(1,e.age/.35)*Math.min(1,(e.life-e.age)/1.2),fl=.82+.18*Math.sin(t*15+e.p*7);
      const TT=Math.min(1,(.22+.5*h1+.7*e.glow)*fl);const spr=this.spr[TT>.7?2:TT>.38?1:0];
      const sz=(5+4*e.z)*e.s*(1+.5*h1+.8*e.glow);
      x.globalAlpha=Math.min(1,life*(.3+.7*TT)*(.45+.2*e.z));x.drawImage(spr,e.x-sz,e.y-sz,sz*2,sz*2)}
    x.globalAlpha=1;x.globalCompositeOperation="source-over";
  }
};

/* The nine Muses, as Hesiod names them (Theogony 77-79), each with a flame that can be fanned. */
function drawFlames(t,dt,vh){
  for(const f of flames){const r=f.cv.getBoundingClientRect();if(r.bottom<0||r.top>vh||r.width<2)continue;
    const dpr=Math.min(dprCap(),devicePixelRatio||1),W=Math.round(r.width*dpr),H=Math.round(r.height*dpr);if(f.cv.width!==W||f.cv.height!==H){f.cv.width=W;f.cv.height=H}
    const cx=r.left+r.width/2,cy=r.top+r.height*.55;
    if(!reduce)for(const pp of PTS){const d=Math.hypot(pp.x-cx,pp.y-cy),RR=Math.max(120,r.width*1.1);if(d<RR){const q=(1-d/RR)*pp.w;f.fan=Math.min(1.5,f.fan+Math.hypot(pp.vx,pp.vy)/1000*q*dt*3.2);f.lean+=((clamp(pp.vx/1600,-.7,.7)*q)-f.lean)*Math.min(1,dt*6)}}
    f.fan*=Math.exp(-dt*.8);f.lean*=Math.exp(-dt*1.5);
    f.I=.32+f.fan;
    const lit=f.I>.9;if(lit!==f.lit){f.lit=lit;f.li.classList.toggle(f.litClass,lit)}
    const x=f.cv.getContext("2d");x.setTransform(dpr,0,0,dpr,0,0);x.clearRect(0,0,r.width,r.height);
    flame(x,r.width,r.height,reduce?0:t,f.seed,f.lean,f.I);
    // a strongly fanned flame throws sparks
    if(!reduce&&fireCv&&f.I>.8&&Math.random()<(f.I-.7)*6*dt)Fire.spawn(cx+(Math.random()-.5)*8,r.top+r.height*.2,(Math.random()-.5)*40+f.lean*80,-90-Math.random()*90,2,.8)}
}
function flame(x,W,H,t,seed,lean,I){
  const cx=W/2,by=H*.74,h=H*.5*Math.min(1.25,.62+.38*I)*(1+.06*Math.sin(t*9+seed)),w=h*.38;
  x.globalCompositeOperation="lighter";
  const gR=Math.min(W*.5,by),gr=x.createRadialGradient(cx,by-h*.4,0,cx,by-h*.4,gR);gr.addColorStop(0,`rgba(255,130,45,${(.1+.22*Math.min(1.2,I)).toFixed(3)})`);gr.addColorStop(1,"rgba(255,80,20,0)");
  x.fillStyle=gr;x.fillRect(0,0,W,H);
  for(const [k,c0,c1,a] of [[1,"200,50,12","140,24,6",.6],[.74,"255,128,40","220,70,16",.8],[.44,"255,236,190","255,176,80",.95]]){
    const hh=h*k,ww=w*k,tx=cx+lean*hh*.8+(Math.sin(t*6.1+seed)*.28+Math.sin(t*13.7+seed*2.3)*.12)*ww*(1+I*.6),ty=by-hh;
    const g2=x.createLinearGradient(0,by,0,ty);g2.addColorStop(0,`rgba(${c0},${a})`);g2.addColorStop(.55,`rgba(${c1},${(a*.75).toFixed(2)})`);g2.addColorStop(1,`rgba(${c1},0)`);
    x.fillStyle=g2;x.beginPath();x.moveTo(cx-ww/2,by);
    x.bezierCurveTo(cx-ww*.62,by-hh*.42,tx-ww*.18,ty+hh*.32,tx,ty);x.bezierCurveTo(tx+ww*.18,ty+hh*.32,cx+ww*.62,by-hh*.42,cx+ww/2,by);
    x.quadraticCurveTo(cx,by+ww*.3,cx-ww/2,by);x.fill()}
  // the lamp: a small clay oil lamp, drawn in a few gold lines
  x.globalCompositeOperation="source-over";x.strokeStyle=T.gold;x.globalAlpha=.55;x.lineWidth=1;x.beginPath();
  const ly=by+5;x.moveTo(cx-6,ly);x.quadraticCurveTo(cx+4,ly+2,cx+12,ly);x.ellipse(cx+20,ly+4,13,6,0,Math.PI*1.08,Math.PI*1.92,true);
  x.moveTo(cx-6,ly);x.quadraticCurveTo(cx-2,ly+6,cx+9,ly+9);x.moveTo(cx+31,ly+1);x.quadraticCurveTo(cx+38,ly-2,cx+35,ly+6);x.stroke();x.globalAlpha=1;
}

/* ---------- Greek-letter emblems for books and the reader ---------- */
/* The Apology as Greek was written in Plato's time: capital letters, no spaces between words, no accents.
   (The iota written under a vowel becomes a full iota beside it, as Athenians then wrote it: ΤΩΙ ΘΕΩΙ.) Capitals carry
   more ink than small letters, so a small face drawn from them stays clear. */
function Letters(cv,img,o){
  let raf=0,cells=[],g,cw,ch,t0,last=0,hot=0;
  function build(){const asp=img.height/img.width,w=o.width();const dpr=Math.min(2,devicePixelRatio||1);cv.width=Math.round(w*dpr);cv.height=Math.round(w*asp*dpr);cv.style.width=w+"px";cv.style.height=(w*asp)+"px";
    const x=cv.getContext("2d");x.setTransform(dpr,0,0,dpr,0,0);g={x,w,h:w*asp};cw=g.w/o.cols;ch=cw*(o.text?1.22:1.45);
    const cols=Math.floor(g.w/cw),rows=Math.floor(g.h/ch);const d=sample(img,cols,rows);cells=[];
    let Ls=new Float32Array(cols*rows);for(let q=0;q<cols*rows;q++){const k=q*4;Ls[q]=(.3*d[k]+.59*d[k+1]+.11*d[k+2])/255}
    if(o.text){// sharpen the features (local contrast), then stretch the tones inside the face, as the library's large Socrates does
      const bl=new Float32Array(cols*rows);for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){let s=0,n=0;for(let dj=-2;dj<=2;dj++)for(let di=-2;di<=2;di++){const jj=j+dj,ii=i+di;if(jj<0||ii<0||jj>=rows||ii>=cols)continue;s+=Ls[jj*cols+ii];n++}bl[j*cols+i]=s/n}
      const S2=Ls.map((v,q)=>v+1.1*(v-bl[q])),inside=[...S2].filter((v,q)=>Ls[q]>.12).sort((a,b)=>a-b);
      const lo=inside[Math.floor(inside.length*.03)]||0,hi=inside[Math.floor(inside.length*.985)]||1;
      // and let the face sit in an oval, fading out at its edge instead of stopping at the picture's frame
      Ls=S2.map((v,q)=>{if(Ls[q]<=.12)return 0;const u=(q%cols)/cols-.5,w=(q/cols|0)/rows-.5,e=(u*u+w*w)/.25,m=1-clamp((e-.62)/.38,0,1);return Math.pow(clamp((v-lo)/(hi-lo),0,1),1.2)*m*m})}
    else Ls=Ls.map(v=>Math.pow(clamp((v-.1)/.9,0,1),1.2));
    const U=o.text?apoCaps():null;let n=0;
    for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){const L=Ls[j*cols+i];
      // the speech runs on, letter after letter, through the face only, so what you can see reads in order
      const tch=U?(L<.05?" ":U[(n++)%U.length]):RAMP[Math.min(RAMP.length-1,Math.round(L*(RAMP.length-1)))];
      cells.push({i,j,L,t:tch,at:(j/rows)*.9+Math.random()*.6})}}
  function draw(el){const x=g.x;x.clearRect(0,0,g.w,g.h);x.textBaseline="top";x.fillStyle=getComputedStyle(o.tokenEl||document.documentElement).getPropertyValue("--a-img").trim()||T.amber;
    const f0=o.text?`500 ${(cw*1.08).toFixed(1)}px ${F.gentium}`:`${(ch*.86).toFixed(1)}px ${F.mono},${F.gentium}`,f1=o.text?`700 ${(cw*1.16).toFixed(1)}px ${F.gentium}`:f0;
    for(const pass of o.text?[0,1]:[0]){x.font=pass?f1:f0;
      for(const c of cells){if(o.text&&(c.L>=.6)!==(pass===1))continue;let s=c.t;
        let early=0;   // before its moment, a letter turns over slowly (three times a second) and glows in, then settles
        if((o.mode==="row"||o.mode==="gather")&&!reduce&&s!==" "){if(el<c.at){const set=o.text?CAPS:GL;s=set[(c.i*7+c.j*13+Math.floor(el*3+c.at*5))%set.length];early=1}else if(!o.text&&Math.random()<.002+hot*.05&&c.L>.15)s=RAMP[clamp(RAMP.indexOf(c.t)+((Math.random()*3|0)-1),1,RAMP.length-1)]}
        if(s===" ")continue;let a=o.text?.07+.93*c.L:.16+.84*c.L;if(early)a*=.3+.7*clamp(el/c.at,0,1);if(o.mode==="row")a*=.55+.45*hot;x.globalAlpha=Math.min(1,a);x.fillText(s,c.i*cw+(o.text?cw*.5:0),c.j*ch)}}
    x.globalAlpha=1}
  function frame(t){if(t-last<33){raf=requestAnimationFrame(frame);return}last=t;const el=(t-t0)/1000;const target=o.isHot&&o.isHot()?1:0;hot+=(target-hot)*.18;draw(el);
    if(el>1.6&&Math.abs(hot-target)<.01&&!target){raf=0;return}raf=requestAnimationFrame(frame)}
  return {start(){build();t0=performance.now();cancelAnimationFrame(raf);if(o.mode==="still"||reduce){draw(99);return}raf=requestAnimationFrame(frame)},
    stop(){cancelAnimationFrame(raf);raf=0},wake(){if(!raf&&!reduce&&o.mode==="row"){last=0;raf=requestAnimationFrame(frame)}},redraw(){if(g)draw(99)}};
}

/* ---------- the reader's opening: a lamp-lit room with dust in a shaft of light ----------
   It lasts only until you scroll into the text: the room fades and then stops moving, so reading is calm. */
function Cover(cv,host,title,isDay){
  let raf=0,motes=null,glyphs=null,t0=0,gone=false;
  function draw(t){if(!cv.isConnected)return false;const w=host.clientWidth,h=host.clientHeight;
    const fade=clamp(1-scrollY/(h*.6),0,1);host.style.setProperty("--atm",fade.toFixed(3));
    const dpr=Math.min(dprCap(),devicePixelRatio||1);if(cv.width!==Math.round(w*dpr)||cv.height!==Math.round(h*dpr)){cv.width=Math.round(w*dpr);cv.height=Math.round(h*dpr)}
    const x=cv.getContext("2d");x.setTransform(dpr,0,0,dpr,0,0);x.clearRect(0,0,w,h);
    if(fade<=0)return false;if(isDay())return true;
    const nm=lite?60:110;if(!motes||motes.length!==nm){motes=[];for(let k=0;k<nm;k++)motes.push({u:Math.random(),v:Math.random(),z:Math.random(),p:Math.random()*6.3});
      glyphs=[...(title||"")].filter(c=>c.trim()).map((c,i)=>({c,u:Math.random(),v:Math.random(),p:i*.7,s:60+Math.random()*120}))}
    const fk=.84+.09*Math.sin(t*8.3)+.07*Math.sin(t*19.1+.6);
    // the lamp behind the title
    const lx=w/2,ly=h*.4,R=Math.max(w,h)*.55,g=x.createRadialGradient(lx,ly,0,lx,ly,R);
    g.addColorStop(0,`rgba(255,150,60,${(.2*fk).toFixed(3)})`);g.addColorStop(.45,`rgba(200,90,30,${(.06*fk).toFixed(3)})`);g.addColorStop(1,"rgba(120,40,10,0)");
    x.fillStyle=g;x.fillRect(0,0,w,h);
    // a shaft of light falling from high on the left
    const sx0=w*.12,sx1=w*.3,sb0=w*.4,sb1=w*.78;x.globalCompositeOperation="lighter";
    const sg=x.createLinearGradient(0,0,w,0);sg.addColorStop(Math.max(0,(sx0+sb0)/2/w-.18),"rgba(255,205,150,0)");sg.addColorStop((sx0+sb0+sx1+sb1)/4/w,"rgba(255,205,150,.05)");sg.addColorStop(Math.min(1,(sx1+sb1)/2/w+.18),"rgba(255,205,150,0)");
    x.fillStyle=sg;x.beginPath();x.moveTo(sx0,0);x.lineTo(sx1,0);x.lineTo(sb1,h);x.lineTo(sb0,h);x.closePath();x.fill();
    // great faint letters of the title, far back in the dark
    x.globalCompositeOperation="source-over";x.fillStyle=T.amber;x.textAlign="center";x.textBaseline="middle";
    for(const q of glyphs){x.font=`300 ${q.s.toFixed(0)}px ${F.display}`;x.globalAlpha=.035+.02*Math.sin(t*.4+q.p);
      x.fillText(q.c,((q.u*w+t*4*(q.p%1-.5))%w+w)%w,q.v*h+Math.sin(t*.25+q.p)*10)}
    // dust: it drifts everywhere, but only shows where the shaft or the lamp catches it
    x.globalCompositeOperation="lighter";x.fillStyle=T.amberHi;
    for(const m of motes){const px=((m.u*w+Math.sin(t*.3+m.p)*30+t*(3+6*m.z))%w+w)%w,py=((m.v*h-t*(4+8*m.z)+Math.sin(t*.5+m.p)*12)%h+h)%h;
      const fy=py/h,cxs=(sx0+sx1)/2+((sb0+sb1)/2-(sx0+sx1)/2)*fy,hw=((sx1-sx0)+((sb1-sb0)-(sx1-sx0))*fy)/2,inS=Math.max(0,1-Math.abs(px-cxs)/hw);
      const nearL=Math.max(0,1-Math.hypot(px-lx,py-ly)/R),a=(.04+.75*inS*inS+.25*nearL)*(.6+.4*Math.sin(t*2+m.p));
      if(a<.02)continue;const r=.5+1.3*m.z;x.globalAlpha=Math.min(1,a);x.beginPath();x.arc(px,py,r,0,6.283);x.fill()}
    x.globalAlpha=1;x.globalCompositeOperation="source-over";return true}
  const loop=t=>{if(gone){raf=0;return}raf=draw((t-t0)/1000)?requestAnimationFrame(loop):0};
  const start=()=>{cancelAnimationFrame(raf);raf=0;t0=performance.now();if(reduce){draw(0);return}raf=requestAnimationFrame(loop)};
  const wake=()=>{if(!raf&&!gone&&!reduce){t0=t0||performance.now();raf=requestAnimationFrame(loop)}else if(reduce)draw(0)};
  addEventListener("scroll",wake,{passive:true});
  return {start,wake,stop(){gone=true;cancelAnimationFrame(raf);removeEventListener("scroll",wake)}};
}

/* ---------- what the site's pages call ---------- */
export function setLevel(level,motionReduced){reduce=level==="performance"||!!motionReduced;lite=level==="balanced"&&!reduce;Engine.kick()}
export function begin(){Engine.start()}
export function opened(){Engine.start();Engine.opened()}
/** a window onto an engraving: kind "coin" (Athena's head, with its rays) or "pic" (any other picture) */
export function addWindow(el,{src,kind="pic"}){Engine.start();const w={el,cv:el.querySelector("canvas"),cap:el.querySelector("[data-wcap]"),src,kind};wins.add(w);Engine.kick();return()=>{wins.delete(w)}}
/** the library's Socrates, pinned behind the page; `span` is how far the page scrolls while he gathers and becomes the roll */
export function addStage(cv,{src,span}){Engine.start();stage={cv,src,span};Engine.kick();return()=>{if(stage&&stage.cv===cv)stage=null}}
export function addLetters(cv){Engine.start();flyCv=cv;Engine.flyPts=null;Engine.kick();return()=>{if(flyCv===cv)flyCv=null}}
export function addFire(cv){Engine.start();fireCv=cv;Fire.pts=[];Engine.kick();return()=>{if(fireCv===cv)fireCv=null}}
/** one Muse's lamp: its canvas, and the element that lights up (with `litClass`) when its flame is fanned */
export function addFlame(li,cv,i,litClass){Engine.start();const f={li,cv,fan:0,lean:0,seed:i*1.73+.4,I:.3,lit:false,litClass};flames.push(f);Engine.kick();return()=>{const k=flames.indexOf(f);if(k>=0)flames.splice(k,1)}}
export function settle(el,words){Engine.start();return Settle.add(el,words)}
/** a heading whose letters the page has already set out (components/a/SettleText.tsx): only its --sp follows the scroll */
export function track(el){Engine.start();const it={el,v:-1};Settle.items.push(it);Engine.kick();return()=>{Settle.items=Settle.items.filter(x=>x!==it)}}
/** the slow wheel; `points` are the places it may settle at, when settling is on
 * @param {boolean} on
 * @param {{settles?: boolean, points?: () => number[]}} [o] */
export function glide(on,{settles=false,points}={}){Glide.on_=on;Glide.settles=settles;Glide.pts=points||(()=>[]);if(!on)Glide.stop()}
/** a book's emblem, its picture drawn in letters; `text` spells it out of the Apology instead (Socrates) */
export async function emblem(cv,src,o){Engine.start();const [img]=await Promise.all([loadImg(src),o.text?loadApology():null]);if(!img||!cv.isConnected)return null;
  if(document.fonts)await document.fonts.ready;const r=Letters(cv,img,o);r.start();return r}
export function cover(cv,host,title,isDay){Engine.start();const c=Cover(cv,host,title,isDay);c.start();return c}
export function refresh(){readTokens();Engine.kick()}
