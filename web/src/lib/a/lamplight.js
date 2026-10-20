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
   holding still), which the sample already had, made to keep its word: what holds still is not drawn again as the page
   scrolls (a window, the floating letters and the library's Socrates only when their size or the colours change; the
   reader's cover only fades), and everything is drawn at the screen's own sharpness, as in Balanced.
 - The wheel's settling at the nearest section can be switched off (the owner, 2026-10-16: "no snapping").
 - Speed (the owner, 2026-10-20: "fix the performance on beauty mode. I think that it's a bit too heavy. Should feel smooth
   on 120hz"): what holds still is drawn once and kept in a picture of its own, and only what moves is drawn each frame:
   each window's engraving (engrave), a figure's face and its object (FigScene); the floating letters are stamped from
   small pictures, and nothing measures the page every frame.
 It is plain JavaScript, as the sample was, and runs in the browser only (components/a/ import it there). */
/* eslint-disable */
let reduce=false,lite=false,gen=0;   // gen: counts changes of colour, so Performance knows to draw again
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
let seed=11;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;

/* ---------- colours and faces, read once per page, never per frame ---------- */
let T={},F={};
const cssv=n=>getComputedStyle(document.documentElement).getPropertyValue(n).trim();
function readTokens(){gen++;T={red:cssv("--red"),gold:cssv("--gold"),goldHi:cssv("--gold-hi"),amber:cssv("--amber"),amberHi:cssv("--amber-hi"),room:cssv("--room"),bg:cssv("--bg")||"#050403"};
  F={gentium:cssv("--font-gentium")||'"Gentium Book Plus",serif',display:cssv("--font-display")||'"Noto Serif Display",serif',mono:cssv("--font-mono")||'"Noto Sans Mono",monospace'}}

/* ---------- the text the figures are spelled out of: the Apology (Burnet's Oxford text, via Perseus) for the library's
   Socrates and the Socrates emblems ---------- */
const APO_URL="/data/a/apology.txt";
const GL="αβγδεζηθικλμνξοπρστυφχψωΑΒΓΔΘΛΞΠΣΦΨΩ";
const RAMP=" ··˙ιιτνυοσρκεαγδζλβξθφψωΦΘΨΩ";
const CAPS="ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ";
const TXT=new Map();   // address -> {raw, chars, caps, p}
function loadText(url){let t=TXT.get(url);if(!t){t={raw:"",chars:[],caps:null,p:null};TXT.set(url,t);
    t.p=fetch(url).then(r=>r.ok?r.text():"").catch(()=>"").then(s=>{t.raw=s.trim();t.chars=[...new Set(t.raw+GL+CAPS)].filter(c=>c!==" ");return t})}
  return t.p}
// the speech as Greek was written in Plato's time: capitals, with no spaces or accents
const toCaps=s=>s.normalize("NFD").replace(/[̀-̈́͆-ͯ]/g,"").toUpperCase().replace(/[^Α-Ω]/g,"");
const capsOf=t=>t.caps||(t.caps=toCaps(t.raw));

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
const dprCap=()=>lite||reduce?1:1.5;
const IRIS_MS=2600,SETTLE_MS=1400;   // a window's iris opening in full; a heading's letters finding their places
let DIM=.66;   // a figure's object behind the page is dimmed to this, so the page's words stay clear over it (set by each stage)

/* The gold lines of an engraving (the coin's, and every other window's): one band of gold for each row of the picture, as
   thick as the picture is light there. The sample drew every band afresh every frame; here they are drawn once into a
   picture of their own (kept on the window, `hold`) and laid on the red at the window's parallax, and only the rows near a
   pointer or a finger are drawn afresh, bending away from it (the owner, 2026-10-20: "Should feel smooth on 120hz"). The
   sample's ripple, a third of a pixel high, is gone with it.
   E = {bx, by, bw, bh, gap, step, R, push, th}: the picture's box with its top as at rest, the rows' spacing, the step
   along a row, how near a pointer bends the lines and how far, and th(k, v): a band's thickness, in rows, at the k-th
   step of the row at v (0 at the top, 1 at the bottom). dy is the parallax now; reveal (0 to 1) how far the window has
   opened, each row drawn only so far from the left. */
function band(g,E,k,dy,i0,i1,ptr){const yc=E.gap/2+k*E.gap,y=E.by+yc+dy,v=yc/E.bh,tp=[],bt=[];
  for(let i=i0;i<=i1;i++){const xx=E.bx+i*E.step;let yy=y;
    if(ptr)for(const pp of ptr){const dx=xx-pp.x,ddy=y-pp.y,dd=Math.hypot(dx,ddy);if(dd<E.R){const q=Math.pow(1-dd/E.R,2)*pp.w;yy+=ddy/(dd||1)*q*E.push}}
    const th=E.th(i,v)*E.gap;tp.push(xx,yy-th/2);bt.push(xx,yy+th/2)}
  if(tp.length<4)return;g.moveTo(tp[0],tp[1]);for(let i=2;i<tp.length;i+=2)g.lineTo(tp[i],tp[i+1]);for(let i=bt.length-2;i>=0;i-=2)g.lineTo(bt[i],bt[i+1]);g.closePath()}
function engrave(x,hold,E,dy,reveal,ptr,dpr){
  const n=Math.max(0,Math.ceil((E.bh-E.gap/2)/E.gap)),im=Math.floor(E.bw/E.step+1e-9),pad=E.gap+E.push,ox=E.bx-4,oy=E.by-pad,W=E.bw+8,H=E.bh+2*pad;
  const key=[Math.round(W*dpr),Math.round(H*dpr),E.gap.toFixed(3),E.bx.toFixed(1),gen].join();
  let c=hold.lines;
  if(!c||hold.linesKey!==key){c=hold.lines||(hold.lines=document.createElement("canvas"));c.width=Math.max(1,Math.round(W*dpr));c.height=Math.max(1,Math.round(H*dpr));
    const g=c.getContext("2d");g.setTransform(dpr,0,0,dpr,-ox*dpr,-oy*dpr);g.fillStyle=T.gold;g.beginPath();
    for(let k=0;k<n;k++)band(g,E,k,0,0,im,null);g.fill();hold.linesKey=key}
  x.save();
  if(reveal<1){const xr=v=>E.bx+E.bw*clamp(reveal*1.25-v*.25,0,1),t0=E.by+dy;x.beginPath();x.moveTo(E.bx-6,t0-pad);x.lineTo(xr(0),t0-pad);
    for(let i=0;i<=8;i++)x.lineTo(xr(i/8),t0+E.bh*i/8);x.lineTo(xr(1),t0+E.bh+pad);x.lineTo(E.bx-6,t0+E.bh+pad);x.closePath();x.clip()}
  // where a pointer is near, a hole in the cached lines (whole rows, so no band is cut across), and those rows bent within it
  let hole=null;
  for(const pp of ptr){const l=pp.x-E.R,r=pp.x+E.R,t=pp.y-E.R,b=pp.y+E.R;if(r<E.bx||l>E.bx+E.bw||b<E.by+dy||t>E.by+dy+E.bh)continue;
    hole=hole?{l:Math.min(hole.l,l),r:Math.max(hole.r,r),t:Math.min(hole.t,t),b:Math.max(hole.b,b)}:{l,r,t,b}}
  const k0=hole?Math.max(0,Math.floor((hole.t-E.by-dy)/E.gap)):0,k1=hole?Math.min(n-1,Math.ceil((hole.b-E.by-dy)/E.gap)):-1;
  if(hole&&k1>=k0){const ht=E.by+dy+k0*E.gap,hb=E.by+dy+(k1+1)*E.gap,i0=Math.max(0,Math.floor((hole.l-E.bx)/E.step)),i1=Math.min(im,Math.ceil((hole.r-E.bx)/E.step));
    const hl=E.bx+i0*E.step,hr=E.bx+i1*E.step;
    x.save();x.beginPath();x.rect(ox-2,oy+dy-2,W+4,H+4);x.rect(hl,ht,hr-hl,hb-ht);x.clip("evenodd");x.drawImage(c,ox,oy+dy,W,H);x.restore();
    x.fillStyle=T.gold;x.beginPath();for(let k=k0;k<=k1;k++)band(x,E,k,dy,i0,i1,ptr);x.fill()}
  else x.drawImage(c,ox,oy+dy,W,H);
  x.restore()}
// the red ground of a window, engraved in fine diagonal hatching
function ground(x,w,h){x.fillStyle=T.red;x.fillRect(0,0,w,h);x.strokeStyle="rgba(0,0,0,.22)";x.lineWidth=.6;x.beginPath();
  for(let k=0;k<w+h+7;k+=7){x.moveTo(k,0);x.lineTo(k-h,h)}x.stroke()}

/* Scene: the coin, engraved in gold on Pompeian red, its rays turning slowly behind it */
function CoinScene(img){
  const sw=180,sh=Math.round(sw*img.height/img.width);const d=sample(img,sw,sh);
  const TH=new Float32Array(sw*sh);for(let i=0;i<sw*sh;i++)TH[i]=d[i*4+3]/255<.5?0:(.08+.92*Math.pow(d[i*4]/255,1.15))*.92;
  const rays=[];for(let b=0;b<16;b++){const a=b/16*Math.PI*2+rnd()*.2;const n=6+(rnd()*9|0);for(let k=0;k<n;k++)rays.push({a:a+(k-n/2)*.011,r0:.36+rnd()*.06,r1:.62+rnd()*.5})}
  for(let k=0;k<180;k++)rays.push({a:k/180*Math.PI*2,r0:.4,r1:.48+rnd()*.06});
  return {draw(x,w,h,t,prog,ptr,an,hold,dpr){
    ground(x,w,h);
    const cx=an.cx,cy=an.cy,S=Math.min(an.w*1.2,an.h*1.05),rot=reduce?0:t*.03;
    x.strokeStyle=T.goldHi;x.lineWidth=.7;x.globalAlpha=.5;x.beginPath();
    for(const r of rays){const a=r.a+rot;x.moveTo(cx+Math.cos(a)*S*r.r0,cy+Math.sin(a)*S*r.r0);x.lineTo(cx+Math.cos(a)*S*r.r1*.62,cy+Math.sin(a)*S*r.r1*.62)}
    x.stroke();x.globalAlpha=1;
    const bw=S*.72,bh=bw*sh/sw,bx=cx-bw/2,by=h/2-bh/2,gap=Math.max(3.4,bw/96),step=2.4;
    engrave(x,hold,{bx,by,bw,bh,gap,step,R:Math.max(90,bw*.2),push:12,th:(i,v)=>TH[clamp(v*sh|0,0,sh-1)*sw+clamp(i*step/bw*sw|0,0,sw-1)]},cy-h/2,reduce?1:clamp(prog/.42,0,1),ptr,dpr)
  }};
}

/* Scene: any other picture, engraved in the same gold lines on Pompeian red, shown whole inside its window. */
function PicScene(img){
  const sw=Math.min(img.width,320),sh=Math.round(sw*img.height/img.width);const d=sample(img,sw,sh);
  const TH=new Float32Array(sw*sh);for(let i=0;i<sw*sh;i++){const m=d[i*4+3]/255;TH[i]=m<.04?0:(.05+.8*Math.pow(d[i*4]/255,1.35))*Math.min(1,m*1.3)}
  const asp=sw/sh;
  return {draw(x,w,h,t,prog,ptr,an,hold,dpr){
    ground(x,w,h);
    const bh=Math.min(an.h*.9,an.w*.9/asp),bw=bh*asp;   // the whole object, with a margin of red around it
    const bx=an.cx-bw/2,by=h/2-bh/2,gap=clamp(Math.min(an.w,an.h)/58,3.1,5.2),step=2.2;
    engrave(x,hold,{bx,by,bw,bh,gap,step,R:Math.max(90,Math.min(bw,bh)*.3),push:10,th:(i,v)=>TH[clamp(v*sh|0,0,sh-1)*sw+clamp(i*step/bw*sw|0,0,sw-1)]},an.cy-h/2,reduce?1:clamp(prog/.42,0,1),ptr,dpr)
  }};
}

/* Glyph atlas: each letter is drawn once, large, in each style; scenes then stamp the letters with drawImage, which costs
   far less than drawing text thousands of times a frame. Drawn large so the lens can enlarge them crisply, and the
   objects grow behind the page. A letter's place in it is found by number (ci: letter -> number; sx, sy: where the n-th
   letter of style s, at s * nc + n, is), not by name, so the frames that stamp thousands look nothing up. */
function Atlas(chars,styles,px){
  const OS=Math.min(2,devicePixelRatio||1)*2.4,F0=px*OS,cw=Math.ceil(F0*1.3),ch=Math.ceil(F0*1.7),nc=chars.length;
  const total=nc*styles.length,per=Math.ceil(Math.sqrt(total*ch/cw));
  const cv=document.createElement("canvas");cv.width=per*cw;cv.height=Math.ceil(total/per)*ch;
  const x=cv.getContext("2d");x.textAlign="center";x.textBaseline="alphabetic";
  const ci=new Map(chars.map((c,i)=>[c,i])),sx=new Float32Array(total),sy=new Float32Array(total);
  styles.forEach((s,si)=>{x.font=`${s.w} ${(F0*s.s).toFixed(1)}px ${F.gentium}`;x.fillStyle=s.c;
    chars.forEach((c,i)=>{const n=si*nc+i,X=(n%per)*cw,Y=(n/per|0)*ch;x.fillText(c,X+cw/2,Y+ch*.7);sx[n]=X;sy[n]=Y})});
  return {cv,ci,sx,sy,nc,cw,ch,OS,base:.7}
}

/* The object the figure's letters become further down its page. It gives its size in letter cells (`size`, from the room
   it has, the face's box and one cell's width and height) and lays itself out (`build`): `text(x, line, brightness)` puts
   the next letter of the text there, `put(x, line, brightness, letter?)` a letter of the object's own shape. A cell holds
   one letter; the text is laid first, so it is never covered. */
const TARGETS={
  // the library's (design A): a papyrus roll, the speech in capitals in columns between two rolled ends, as a book was in Plato's time
  roll:{size(maxW,boxW,boxH,cw,ch){const C2=Math.max(30,Math.floor(Math.min(maxW,boxW*1.18)/cw));return{C2,R2:Math.max(14,Math.round(C2*cw*.56/ch))}},
    build({C2,R2,text,put}){const rl=Math.max(3,Math.round(C2*.075)),top=1,bot=R2-2,t0=rl+2,t1=C2-rl-2;
      const ncol=t1-t0>=40?3:2,gapc=Math.max(2,Math.round((t1-t0)*.07)),cc=Math.floor((t1-t0-gapc*(ncol-1))/ncol);
      for(let c=0;c<ncol;c++)for(let l=top+2;l<=bot-2;l++)for(let i=0;i<cc;i++)text(t0+c*(cc+gapc)+i,l,.48+.14*rnd());
      for(const l of[top,bot])for(let gx=rl;gx<C2-rl;gx++)put(gx,l,.3);   // the sheet's top and bottom edges
      for(const side of[0,1])for(let l=0;l<R2;l++)for(let i=0;i<rl;i++){const u=(i+.5)/rl,sh=Math.pow(Math.sin(Math.PI*u),.7)*(side?.82+.18*u:1-.18*u);   // the rolled ends, shaded like cylinders
        put(side?C2-rl+i:i,l,(.14+.78*sh)*(l===0||l===R2-1?.55:1))}}},
};

/* Scene: a face spelled out of a Greek text, in a dark room lit by one lamp: design A's Socrates, spelled out of Plato's
   Apology (the library).
   Every letter is the text in reading order; only their brightness draws the face. With a pointer, the lamp is also a
   reading glass that enlarges the letters under it.
   The face stands in its opening near the top of the page (an element marked data-face-anchor) and moves with the page.
   Scroll on, and its letters fly out and become its object (TARGETS above: the library's papyrus roll, as A drew it),
   grown large behind the whole page and dimmed, so the page's words stay clear over it. It stays there
   until you scroll back to the top, and then the letters fly back into the face (the owner, 2026-10-20: "The figures should
   grow into the background, as you scroll, then stay there, until you scroll back to the top, then it animates into the
   face again"). `tx` is the text (loadText), `target` the object's name, `img2` its picture.
   For speed (the owner, 2026-10-20: "Should feel smooth on 120hz"), what holds still is kept in pictures of its own and
   only laid down each frame: the face (each letter stamped into it once, as it arrives) and the object. The speech rising
   slowly through the face is drawn into a second picture a few rows a frame, and swapped in when it is done. Only the
   letters in flight are drawn one by one. */
function FigScene(img,tx,target,img2){
  let lay=null,gath=null,job=null,front=null,objK="";
  const faceC=[document.createElement("canvas"),document.createElement("canvas")],objC=document.createElement("canvas");
  // the face's own space has its centre at 0, 0; the object's too (it is placed and scaled when drawn)
  function layout(fw,fh){const key=[fw|0,fh|0,T.amber].join();if(lay&&lay.key===key)return lay;
    const asp=img.width/img.height;let boxH=fh*.98,boxW=boxH*asp;const maxW=fw*.98;if(boxW>maxW){boxW=maxW;boxH=boxW/asp}
    const bx=-boxW/2,by=-boxH/2;
    const cols=clamp(Math.round(boxW/6.2),44,96),cw=boxW/cols,ch=cw*1.26,rows=Math.floor(boxH/ch);
    const d=sample(img,cols,rows),N=cols*rows,G=new Float32Array(N),fly=[];
    for(let k=0;k<N;k++)G[k]=(.3*d[k*4]+.59*d[k*4+1]+.11*d[k*4+2])/255;
    // sharpen the features against their surroundings (eyes, brow, nose and beard), then stretch the head's tones to full range
    const Bl=new Float32Array(N),rad=Math.max(2,Math.round(cols/22));
    for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){let sum=0,c=0;for(let v=Math.max(0,j-rad);v<=Math.min(rows-1,j+rad);v++)for(let u=Math.max(0,i-rad);u<=Math.min(cols-1,i+rad);u++){sum+=G[v*cols+u];c++}Bl[j*cols+i]=sum/c}
    for(let k=0;k<N;k++)G[k]=G[k]<.1?G[k]:clamp(G[k]+1.1*(G[k]-Bl[k]),0,1);
    const lit=[...G].filter(v=>v>.12).sort((a,b)=>a-b),lo=lit[Math.floor(lit.length*.04)]||.1,hi=lit[Math.floor(lit.length*.98)]||1;
    for(let k=0;k<N;k++){const v=clamp((G[k]-lo)/(hi-lo),0,1);G[k]=Math.pow(v,1.25);
      // each loose letter wanders slowly round a resting place of its own (u, v: across and down the window) until it is called home
      fly.push({at:((k/cols|0)/rows)*.8+rnd()*.5,u:rnd(),v:rnd(),sub:rnd()<.38,w1:.03+rnd()*.07,w2:.025+rnd()*.06,ph:rnd()*6.3,amp:30+rnd()*70,c:tx.chars[(rnd()*tx.chars.length)|0]})}
    const glow=document.createElement("canvas");glow.width=cols;glow.height=rows;{const gx=glow.getContext("2d"),gi=gx.createImageData(cols,rows),[R0,G0,B0]=[255,150,60];
      for(let k=0;k<N;k++){gi.data[k*4]=R0;gi.data[k*4+1]=G0;gi.data[k*4+2]=B0;gi.data[k*4+3]=G[k]*255}gx.putImageData(gi,0,0)}
    // the object: the text in capitals, as Greek was written then, and the object's own shape in letters around it
    const TG=TARGETS[target]||TARGETS.roll,{C2,R2}=TG.size(fw*.98,boxW,boxH,cw,ch,img2);
    const rx=-C2*cw/2,ry=-R2*ch/2,CAPS_=capsOf(tx),slots=[],rest=[],G2=new Float32Array(C2*R2),occ=new Uint8Array(C2*R2);
    const at=(gx,l)=>gx>=0&&gx<C2&&l>=0&&l<R2&&!occ[l*C2+gx];
    const slot=(arr,gx,l,g,c)=>{occ[l*C2+gx]=1;arr.push({x:rx+(gx+.5)*cw,y:ry+l*ch+ch*.86,g,c});G2[l*C2+gx]=g};
    let ci0=0;
    // the text first, in reading order (the light reads it in that order), then the object's own parts
    TG.build({C2,R2,img:img2,text:(gx,l,g)=>{if(at(gx,l))slot(slots,gx,l,g,CAPS_[ci0++%CAPS_.length])},put:(gx,l,g,c)=>{if(at(gx,l))slot(rest,gx,l,g,c||CAPS[(gx*7+l*13)%24])}});
    const nText=slots.length;for(const r of rest)slots.push(r);
    for(let s2=0;s2<slots.length;s2++){const k=Math.floor((s2+.5)*N/slots.length);fly[k].sl=s2}
    fly.forEach((fl,k)=>{fl.d=.3*((k/cols|0)/rows)+.6*rnd();fl.fx=(rnd()-.5)*70;fl.fy=50+rnd()*120;if(fl.sl===undefined)fl.sl=-1});   // the crown lets go first
    const glow2=document.createElement("canvas");glow2.width=C2;glow2.height=R2;{const gx=glow2.getContext("2d"),gi=gx.createImageData(C2,R2);
      for(let k=0;k<C2*R2;k++){gi.data[k*4]=255;gi.data[k*4+1]=150;gi.data[k*4+2]=60;gi.data[k*4+3]=G2[k]*255}gx.putImageData(gi,0,0)}
    const roll={C2,R2,rx,ry,slots,nText,glow:glow2,soft:softGlow(glow2)};
    const fpx=cw*1.24,A=Atlas(tx.chars,[{w:400,s:.84,c:T.amber},{w:400,s:1.04,c:T.amber},{w:700,s:1.2,c:T.amberHi}],fpx);
    const num=c=>{const v=A.ci.get(c);return v===undefined?-1:v};
    for(const fl of fly)fl.ci=num(fl.c);for(const sl of slots)sl.ci=num(sl.c);
    const lineC=wrapText(tx.raw,cols).map(l=>{const a=new Int16Array(cols);for(let i=0;i<cols;i++){const c=l[i];a[i]=c===undefined||c===" "?-1:num(c)}return a});
    gath=null;job=null;front=null;objK="";
    return lay={key,cols,rows,cw,ch,bx,by,boxW,boxH,G,fly,A,glow,soft:softGlow(glow),roll,gw:A.cw/A.OS,gh:A.ch/A.OS,lineC,pad:ch*1.6}}
  function softGlow(src){const c=document.createElement("canvas");c.width=src.width*4;c.height=src.height*4;const g=c.getContext("2d");g.imageSmoothingEnabled=true;g.filter="blur(6px)";g.drawImage(src,0,0,c.width,c.height);return c}
  // a letter's place in the atlas: its style (by brightness) and its number
  const sty=(A,g)=>g<.3?0:g<.6?A.nc:2*A.nc;
  // a picture of the face, `pad` round its box, ready to be drawn into in the face's own space
  function prep(c,L,dpr){const W=L.boxW+2*L.pad,H=L.rows*L.ch+2*L.pad,w=Math.max(1,Math.round(W*dpr)),h=Math.max(1,Math.round(H*dpr));
    if(c.width!==w||c.height!==h){c.width=w;c.height=h}const g=c.getContext("2d");g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,w,h);
    g.setTransform(dpr,0,0,dpr,(L.pad-L.bx)*dpr,(L.pad-L.by)*dpr);g.imageSmoothingEnabled=true;return g}
  const blitFace=(x,c,L,fcx,fcy)=>x.drawImage(c,fcx+L.bx-L.pad,fcy+L.by-L.pad,L.boxW+2*L.pad,L.rows*L.ch+2*L.pad);
  // the face at rest, rows j0 to j1: off = how far the speech has risen (in lines); the last row shows only its risen part
  function paintRows(g,L,off,j0,j1){const A=L.A,o0=Math.floor(off),fr=off-o0,n=L.lineC.length,C=L.cols,G=L.G,gw=L.gw,gh=L.gh,drop=L.ch*.86;
    for(let j=j0;j<=j1;j++){const gy=j-fr,ty=L.by+gy*L.ch+drop,line=L.lineC[(o0+j)%n],r0=clamp(Math.floor(gy),0,L.rows-1),r1=clamp(r0+1,0,L.rows-1),f=gy-Math.floor(gy),edge=j===0?1-fr:(j===L.rows?fr:1);
      if(edge<=0)continue;const a0=r0*C,a1=r1*C;
      for(let i=0;i<C;i++){const s=line[i];if(s<0)continue;const gv=G[a0+i]*(1-f)+G[a1+i]*f,a=(.03+1.1*gv)*edge;if(a<.012)continue;
        const q=sty(A,gv)+s;g.globalAlpha=a>1?1:a;g.drawImage(A.cv,A.sx[q],A.sy[q],A.cw,A.ch,L.bx+(i+.5)*L.cw-gw/2,ty-gh*A.base,gw,gh)}}
    g.globalAlpha=1}
  // the still face at `off`: the one ready, while the next is drawn into the other picture, a fifth of its rows a frame
  function stillFace(L,off,dpr){const lk=L.key+"|"+dpr+"|"+gen;
    if(front&&front.lk===lk&&front.off===off)return faceC[0];
    const ready=!!front&&front.lk===lk;
    if(!job||job.lk!==lk||job.off!==off)job={lk,off,j:0,g:prep(faceC[1],L,dpr)};
    const per=ready?Math.ceil((L.rows+1)/5):L.rows+1;paintRows(job.g,L,off,job.j,Math.min(L.rows,job.j+per-1));job.j+=per;
    if(job.j>L.rows){faceC.reverse();front={lk,off};job=null;return faceC[0]}
    return ready?faceC[0]:null}
  // the letters gathering into the face (asm: seconds since they began): each one that has found its place is stamped once
  // into the still face; only those still on their way are drawn each frame
  function gatherFrame(x,L,t,asm,fcx,fcy,vw,vh,dpr){const lk=L.key+"|"+dpr+"|"+gen;
    if(!gath||gath.lk!==lk){gath={lk,done:new Uint8Array(L.cols*L.rows),n:0,g:prep(faceC[0],L,dpr)};front=null;job=null}
    const A=L.A,C=L.cols,G=L.G,gw=L.gw,gh=L.gh,drop=L.ch*.86,done=gath.done,g=gath.g,n=L.lineC.length,q0=reduce?0:t;
    for(let j=0;j<L.rows;j++){const line=L.lineC[j%n];
      for(let i=0;i<C;i++){const k0=j*C+i;if(done[k0])continue;const s=line[i];
        if(s>=0&&asm-L.fly[k0].at<.6)continue;done[k0]=1;gath.n++;if(s<0)continue;
        const gv=G[k0],a=.03+1.1*gv;if(a<.012)continue;const q=sty(A,gv)+s;
        g.globalAlpha=a>1?1:a;g.drawImage(A.cv,A.sx[q],A.sy[q],A.cw,A.ch,L.bx+(i+.5)*L.cw-gw/2,L.by+j*L.ch+drop-gh*A.base,gw,gh)}}
    g.globalAlpha=1;blitFace(x,faceC[0],L,fcx,fcy);
    for(let j=0;j<L.rows;j++){const line=L.lineC[j%n];
      for(let i=0;i<C;i++){const k0=j*C+i;if(done[k0])continue;const fl=L.fly[k0],k=clamp((asm-fl.at)/.6,0,1);let s=line[i],a=.03+1.1*G[k0];
        let px=fcx+L.bx+(i+.5)*L.cw,py=fcy+L.by+j*L.ch+drop;
        if(fl.sub){const e=1-Math.pow(1-k,3),ox=fl.u*vw+Math.sin(q0*fl.w1+fl.ph)*fl.amp,oy=fl.v*vh+Math.cos(q0*fl.w2+fl.ph*1.3)*fl.amp*.7;
          px=ox+(px-ox)*e;py=oy+(py-oy)*e;if(k<.9)s=fl.ci;a=Math.max(a,.26)*(.45+.55*k)}
        else{if(k<.6)continue;a*=(k-.6)/.4}
        if(a<.012||s<0||px<-gw||px>vw+gw||py<-gh||py>vh+gh)continue;
        const q=sty(A,G[k0])+s;x.globalAlpha=a>1?1:a;x.drawImage(A.cv,A.sx[q],A.sy[q],A.cw,A.ch,px-gw/2,py-gh*A.base,gw,gh)}}
    x.globalAlpha=1;
    if(gath.n>=C*L.rows){front={lk,off:0};gath=null}}
  // the object at rest, grown S times, in a picture of its own; returns where it lies round the object's centre
  function stillObj(L,S,dpr){const R=L.roll,pad=L.pad,W=(R.C2*L.cw+2*pad)*S,H=(R.R2*L.ch+2*pad)*S,key=[L.key,S,dpr,gen].join("|");
    if(objK!==key){objC.width=Math.max(1,Math.round(W*dpr));objC.height=Math.max(1,Math.round(H*dpr));const g=objC.getContext("2d");
      g.setTransform(dpr*S,0,0,dpr*S,(pad-R.rx)*S*dpr,(pad-R.ry)*S*dpr);g.imageSmoothingEnabled=true;paintRoll(g,L);objK=key}
    return {x:(R.rx-pad)*S,y:(R.ry-pad)*S,W,H}}
  function paintRoll(g,L){const A=L.A,R=L.roll,gw=L.gw,gh=L.gh;g.globalAlpha=.09;g.drawImage(R.soft,R.rx,R.ry,R.C2*L.cw,R.R2*L.ch);
    for(const sl of R.slots){if(sl.ci<0)continue;const q=sty(A,sl.g)+sl.ci,a=.03+1.1*sl.g;g.globalAlpha=a>1?1:a;g.drawImage(A.cv,A.sx[q],A.sy[q],A.cw,A.ch,sl.x-gw/2,sl.y-gh*A.base,gw,gh)}
    g.globalAlpha=1}
  // the reading glass, in the face's own space: the letters under it enlarged
  function paintLens(x,L,off,lens){const A=L.A,o0=Math.floor(off),fr=off-o0,n=L.lineC.length,C=L.cols,G=L.G,M=lens.m,drop=L.ch*.86,gw=L.gw*M,gh=L.gh*M,r2=(lens.r/M)**2;
    const j0=Math.floor((lens.y-lens.r/M-L.by)/L.ch+fr)-1,j1=Math.ceil((lens.y+lens.r/M-L.by)/L.ch+fr)+1;
    for(let j=Math.max(0,j0);j<=Math.min(L.rows,j1);j++){const gy=j-fr,ty=L.by+gy*L.ch,line=L.lineC[(o0+j)%n],r0=clamp(Math.floor(gy),0,L.rows-1),r1=clamp(r0+1,0,L.rows-1),f=gy-Math.floor(gy),edge=j===0?1-fr:(j===L.rows?fr:1);
      for(let i=0;i<C;i++){const s=line[i];if(s<0)continue;const dx=L.bx+(i+.5)*L.cw-lens.x,dy=ty+drop-lens.y;if(dx*dx+dy*dy>r2)continue;
        const gv=G[r0*C+i]*(1-f)+G[r1*C+i]*f,a=(.3+.7*gv)*edge;if(a<.012)continue;const q=sty(A,gv)+s;
        x.globalAlpha=a>1?1:a;x.drawImage(A.cv,A.sx[q],A.sy[q],A.cw,A.ch,lens.x+dx*M-gw/2,lens.y+dy*M-gh*A.base,gw,gh)}}
    x.globalAlpha=1}
  // between the two: each letter falls a little, then glides to its place in the object, growing as it goes; the rest fall
  // and fade into the dark. m runs from 0 (the face) to 1 (the object), and back
  function paintMorph(x,L,off,m,fcx,fcy,ocx,ocy,S,vw,vh){const A=L.A,R=L.roll,o0=Math.floor(off),fr=off-o0,n=L.lineC.length,C=L.cols,G=L.G,gw=L.gw,gh=L.gh,drop=L.ch*.86,m5=clamp(m*5,0,1),dS=S-1;
    x.globalAlpha=.09*(1-m);x.drawImage(L.soft,fcx+L.bx,fcy+L.by,L.boxW,L.rows*L.ch);x.globalAlpha=.09*m*DIM;x.drawImage(R.soft,ocx+R.rx*S,ocy+R.ry*S,R.C2*L.cw*S,R.R2*L.ch*S);
    for(let j=0;j<L.rows;j++){const line=L.lineC[(o0+j)%n],ty=fcy+L.by+(j-fr)*L.ch+drop,r=j*C;
      for(let i=0;i<C;i++){const fl=L.fly[r+i],k=clamp((m*1.55-fl.d)/.55,0,1),g0=G[r+i],a0=.03+1.1*g0,x0=fcx+L.bx+(i+.5)*L.cw;
        let s=line[i],px=x0,py=ty,a=a0,g=g0,sc=1;
        if(fl.sl<0){if(s<0)continue;if(a0<.1){a=a0*(1-m5);if(a<.012)continue}
          else{if(k>=1)continue;const e=k*k;px+=fl.fx*.7*e;py+=fl.fy*1.5*e;a=a0*Math.pow(1-k,1.6)}}
        else{const sl=R.slots[fl.sl],e=k<.5?2*k*k:1-2*(1-k)*(1-k),u=1-e,tx=ocx+sl.x*S,tY=ocy+sl.y*S,cx=x0+fl.fx,cy=ty+fl.fy;
          px=u*u*x0+2*u*e*cx+e*e*tx;py=u*u*ty+2*u*e*cy+e*e*tY;g=g0+(sl.g-g0)*e;sc=1+dS*e;
          // dark letters brighten a little in flight, so the ones the object needs are seen going to it; they land as the object shows them
          a=Math.max(.64*e*(1-e),a0+(Math.min(1,.03+1.1*sl.g)*DIM-a0)*e);
          if(s<0||k>.85)s=k>.85?sl.ci:fl.ci}
        if(a<.012||s<0)continue;const w=gw*sc,h=gh*sc;if(px<-w||px>vw+w||py<-h||py>vh+h)continue;
        const q=sty(A,g)+s;x.globalAlpha=a>1?1:a;x.drawImage(A.cv,A.sx[q],A.sy[q],A.cw,A.ch,px-w/2,py-h*A.base,w,h)}}
    x.globalAlpha=1}
  // once the object has formed, the same slow light reads its text (in the object's own space)
  function idleRoll(x,L,t){const A=L.A,R=L.roll;if(!R.nText)return;const i0=Math.floor(t*9)%R.nText;
    for(let k=Math.max(0,i0-44);k<=i0;k++){const sl=R.slots[k];if(sl.ci<0)continue;const q=2*A.nc+sl.ci,a=Math.exp(-(i0-k)/14),sc=1+.26*a,w=L.gw*sc,h=L.gh*sc;
      x.globalAlpha=Math.min(1,.25+.75*a)*DIM;x.drawImage(A.cv,A.sx[q],A.sy[q],A.cw,A.ch,sl.x-w/2,sl.y-h*A.base,w,h)}
    const sl=R.slots[i0],g=x.createRadialGradient(sl.x,sl.y-L.ch*.4,0,sl.x,sl.y-L.ch*.4,L.ch*3.2);g.addColorStop(0,"rgba(255,190,110,.42)");g.addColorStop(1,"rgba(255,150,60,0)");
    x.globalAlpha=DIM;x.globalCompositeOperation="lighter";x.fillStyle=g;x.fillRect(sl.x-L.ch*3.2,sl.y-L.ch*3.6,L.ch*6.4,L.ch*6.4);x.globalCompositeOperation="source-over";x.globalAlpha=1}
  // what moves on the face while nobody scrolls, once it has gathered: a light that reads the speech slowly across it (face space)
  function idleFace(x,L,t,off){const A=L.A,gw=L.gw,gh=L.gh,C=L.cols,o0=Math.floor(off),fr=off-o0,n=L.lineC.length,span=Math.max(1,L.rows-14),cp=t*9,j=7+Math.floor(cp/C)%span,i0=Math.floor(cp%C);
    const line=L.lineC[(o0+j)%n],py=L.by+(j-fr)*L.ch+L.ch*.86;
    for(let k=Math.max(0,i0-44);k<=i0;k++){const s=line[k];if(s===undefined||s<0)continue;const q=2*A.nc+s;
      const a=Math.exp(-(i0-k)/14),sc=1+.26*a,w=gw*sc,h=gh*sc,px=L.bx+(k+.5)*L.cw;x.globalAlpha=Math.min(1,.25+.75*a);
      x.drawImage(A.cv,A.sx[q],A.sy[q],A.cw,A.ch,px-w/2,py-h*A.base,w,h)}
    const cx=L.bx+(i0+.5)*L.cw,g=x.createRadialGradient(cx,py-L.ch*.4,0,cx,py-L.ch*.4,L.ch*3.2);g.addColorStop(0,"rgba(255,190,110,.42)");g.addColorStop(1,"rgba(255,150,60,0)");
    x.globalAlpha=1;x.globalCompositeOperation="lighter";x.fillStyle=g;x.fillRect(cx-L.ch*3.2,py-L.ch*3.6,L.ch*6.4,L.ch*6.4);x.globalCompositeOperation="source-over"}
  // now and then a slow band of light passes across the face or the object, as if someone carried a lamp by; it lights the letters only
  function band(x,t,src,X,Y,W,H,amt){const u=(t*.085)%1.6-.3,k=Math.sin(Math.PI*clamp((u+.3)/1.6,0,1))*amt;if(k<=.04)return;
    const bw=src.width,bh=src.height;if(!src.band){src.band=document.createElement("canvas");src.band.width=bw;src.band.height=bh}
    const b=src.band.getContext("2d"),c0=u*1.4-.2;b.globalCompositeOperation="source-over";b.clearRect(0,0,bw,bh);b.drawImage(src,0,0);
    b.globalCompositeOperation="destination-in";const sg=b.createLinearGradient((c0-.24)*bw,0,(c0+.24)*bw,0);sg.addColorStop(0,"rgba(0,0,0,0)");sg.addColorStop(.5,"rgba(0,0,0,1)");sg.addColorStop(1,"rgba(0,0,0,0)");
    b.fillStyle=sg;b.fillRect(0,0,bw,bh);x.globalCompositeOperation="lighter";x.globalAlpha=.3*k;x.imageSmoothingEnabled=true;x.drawImage(src.band,X,Y,W,H);x.globalCompositeOperation="source-over";x.globalAlpha=1}
  /* st: {face: its opening now, in the window's coordinates ({x, y, w, h}); asm: seconds since its letters began to gather
     (9 once gathered); m: 0 the face, 1 the object; off: how far the speech has risen; still: Performance, drawn once as it
     ends; dpr: the canvas's sharpness; veil: draws the veils behind the page's words, or null; dim: how bright the object
     is behind the page, smax: how much larger than the face's box it may grow}. x is set to the window's
     coordinates. */
  return {draw(x,vw,vh,t,st,ptr){
    const f=st.face,L=layout(f.w,f.h),R=L.roll,still=st.still,m=st.m,dpr=st.dpr,off=still?0:st.off,asm=still?9:st.asm;
    const fcx=f.x+f.w/2,fcy=f.y+f.h/2,ocx=vw/2,ocy=vh*.5+Math.min(28,vh*.03);   // the object a little below the middle (the header is above)
    // how much it grows: to fill most of the window
    const S=Math.round(clamp(Math.min(vw*.9/(R.C2*L.cw),vh*.8/(R.R2*L.ch)),.8,st.smax)*50)/50;DIM=st.dim;
    x.imageSmoothingEnabled=true;
    if(m<=0){const gathering=!still&&asm<2.2&&!(front&&front.lk===L.key+"|"+dpr+"|"+gen);
      if(asm>.9){x.globalAlpha=.09*clamp((asm-.9)/.9,0,1);x.drawImage(L.soft,fcx+L.bx,fcy+L.by,L.boxW,L.rows*L.ch);x.globalAlpha=1}
      if(gathering)gatherFrame(x,L,t,asm,fcx,fcy,vw,vh,dpr);
      else{const c=stillFace(L,off,dpr);if(c)blitFace(x,c,L,fcx,fcy)}
      if(!still){x.save();x.translate(fcx,fcy);if(asm>2.2)idleFace(x,L,t,off);if(asm>1.2)band(x,t,L.glow,L.bx,L.by,L.boxW,L.rows*L.ch,clamp(asm-1.2,0,1));x.restore()}}
    else if(m<1){if(asm>=2.2)stillFace(L,off,dpr);   // keeps the face's next picture coming, so it is ready when the letters fly back
      paintMorph(x,L,off,m,fcx,fcy,ocx,ocy,S,vw,vh)}
    else{const o=stillObj(L,S,dpr);x.globalAlpha=DIM;x.drawImage(objC,ocx+o.x,ocy+o.y,o.W,o.H);x.globalAlpha=1;
      if(!still){x.save();x.translate(ocx,ocy);x.scale(S,S);idleRoll(x,L,t);band(x,t,R.glow,R.rx,R.ry,R.C2*L.cw,R.R2*L.ch,DIM);x.restore()}}
    // the lamp: a warm glow under the pointer, or under each finger (and drifting by itself when nothing touches); dimmer over the object
    const oW=R.C2*L.cw*S,oH=R.R2*L.ch*S,lcx=fcx+(ocx-fcx)*m,lcy=fcy+(ocy-fcy)*m,dw=(L.boxW*(1-m)+oW*m)*.32,dh=(L.boxH*(1-m)+oH*m)*.26;
    const lamps=ptr.length&&!still?ptr:[{x:lcx+dw*Math.sin(still?0:t*.33),y:lcy+dh*Math.cos(still?0:t*.27),w:1}];
    const fk=still?1:.82+.1*Math.sin(t*9.7)+.08*Math.sin(t*23.3+1.1),R0=Math.max(L.boxW*(1-m)+oW*m,L.boxH*(1-m)+oH*m)*.5*(lamps.length>1?.75:1),dimL=1-(1-DIM)*m;
    x.globalCompositeOperation="lighter";
    for(const lp of lamps){const a=.17*fk*lp.w*dimL/Math.sqrt(lamps.length),gr=x.createRadialGradient(lp.x,lp.y,0,lp.x,lp.y,R0);gr.addColorStop(0,`rgba(255,150,60,${a.toFixed(3)})`);gr.addColorStop(.5,`rgba(255,120,40,${(a*.3).toFixed(3)})`);gr.addColorStop(1,"rgba(255,120,40,0)");
      x.fillStyle=gr;x.fillRect(lp.x-R0,lp.y-R0,2*R0,2*R0)}
    x.globalCompositeOperation="source-over";
    if(st.veil)st.veil();   // on the pages inside an area, the veils behind the page's words
    // the reading glass: only while you press and hold on the face, once it has gathered
    const hp=ptr.find(pp=>pp.held);
    if(hp&&!still&&m<=0&&asm>1.9&&hp.x>fcx+L.bx-20&&hp.x<fcx-L.bx+20&&hp.y>fcy+L.by-20&&hp.y<fcy-L.by+20){const lx=hp.x,ly=hp.y,r=clamp(L.boxW*.15,46,82);
      x.save();x.beginPath();x.arc(lx,ly,r,0,Math.PI*2);x.clip();x.fillStyle=T.room;x.globalAlpha=.94;x.fillRect(lx-r,ly-r,2*r,2*r);x.globalAlpha=1;
      x.translate(fcx,fcy);paintLens(x,L,off,{x:lx-fcx,y:ly-fcy,r,m:2.3});x.restore();
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

/* Headings settle as they come into view: their letters drift in from small offsets and find their places, by themselves
   (the owner, 2026-10-19: animations play once on view and stay), and stay settled. The browser says when one comes into
   view (an IntersectionObserver), so no frame has to measure the page to find out. */
const Settle={items:[],io:null,of:new WeakMap(),
  watch(it){if(reduce){it.t0=0;return}
    if(!this.io)this.io=new IntersectionObserver(es=>{for(const e of es){if(!e.isIntersecting)continue;const it=this.of.get(e.target);this.io.unobserve(e.target);
      if(it&&it.t0==null){it.t0=Math.max(performance.now(),Engine.introT0+250);Engine.kick()}}},{rootMargin:"0px 0px -8% 0px"});
    this.of.set(it.el,it);this.io.observe(it.el)},
  drop(it){this.items=this.items.filter(x=>x!==it);if(this.io)this.io.unobserve(it.el)},
  add(el,words){if(reduce||el.dataset.settle)return()=>{};el.dataset.settle="1";const text=el.textContent;
    const parts=words?text.split(/(\s+)/):text.split(/(\s+)/).map(w=>/^\s+$/.test(w)?w:[...w]);let n=0;const total=words?parts.filter(w=>!/^\s+$/.test(w)).length:text.replace(/\s/g,"").length;
    const sp=c=>{const i=n++/Math.max(1,total-1),dx=((rnd()-.5)*(words?.5:.9)).toFixed(2),dy=((rnd()-.2)*(words?.7:1.1)).toFixed(2),r=((rnd()-.5)*(words?4:18)).toFixed(1);
      return `<span class="st-l" style="--i:${i.toFixed(3)};--dx:${dx}em;--dy:${dy}em;--r:${r}deg">${c}</span>`};
    const esc=c=>c.replace(/&/g,"&amp;").replace(/</g,"&lt;");
    const before=el.innerHTML;
    el.innerHTML=`<span class="st-sr">${esc(text)}</span><span aria-hidden="true">${parts.map(w=>typeof w==="string"?(/^\s+$/.test(w)?w:sp(esc(w))):`<span class="st-w">${w.map(c=>sp(esc(c))).join("")}</span>`).join("")}</span>`;
    const it={el,v:-1};this.items.push(it);this.watch(it);Engine.kick();
    return()=>{this.drop(it);delete el.dataset.settle;el.innerHTML=before}},
  frame(){const now=performance.now();for(const it of this.items){if(it.v>=1||it.t0==null)continue;
    const k=clamp((now-it.t0)/SETTLE_MS,0,1),v=reduce?1:Math.round(k*(2-k)*200)/200;if(v!==it.v){it.v=v;it.el.style.setProperty("--sp",v)}}}
};

/* The veils. On the pages inside an area the figure's object lies behind the page's own words, so every line of words has a
   soft dark cloud behind it, drawn over the object: no letter of the object is ever seen through a word (the owner,
   2026-10-19: no overlaps), and the object shows wherever there are no words. The lines are measured as the floating
   letters' are, when the page opens, as it settles and when it changes, never every frame; the lines inside a part of the
   page that stays put as it scrolls (a sticky side panel) are measured from that part, and follow it. */
const Veil={root:null,rows:null,st:[],dirty:true,t:0,mo:null,ro:null,tm:[],idle:0,
  attach(root){this.detach();this.root=root;this.rows=null;this.dirty=true;
    const mark=()=>{this.dirty=true};this.mo=new MutationObserver(mark);this.mo.observe(root,{childList:true,subtree:true,characterData:true});
    if(typeof ResizeObserver!=="undefined"){this.ro=new ResizeObserver(mark);this.ro.observe(root)}
    this.tm=[400,1200,3000].map(ms=>setTimeout(mark,ms))},
  detach(){if(this.mo)this.mo.disconnect();if(this.ro)this.ro.disconnect();for(const t of this.tm)clearTimeout(t);this.mo=this.ro=null;this.tm=[];this.root=null;this.rows=null},
  measure(){const root=this.root;if(!root||!root.isConnected)return;const rows=new Map(),st=new Map(),near=new Map(),rg=document.createRange(),sy=scrollY;
    // the nearest part of the page that stays put as it scrolls, if any, for each element with words in it
    const pinned=el=>{const chain=[];let e=el,res=null;while(e&&e!==root){if(near.has(e)){res=near.get(e);break}chain.push(e);const p=getComputedStyle(e).position;if(p==="sticky"||p==="fixed"){res=e;break}e=e.parentElement}for(const c of chain)near.set(c,res);return res};
    const tw=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    for(let n;(n=tw.nextNode());){if(!n.textContent.trim())continue;const el=n.parentElement;if(!el)continue;rg.selectNodeContents(n);const rs=rg.getClientRects();if(!rs.length)continue;
      const s=pinned(el);let o=null;if(s){o=st.get(s);if(!o){const r=s.getBoundingClientRect();o={el:s,x:r.left,y:r.top,list:[]};st.set(s,o)}}
      for(const r of rs){if(r.width<2||r.height<2)continue;
        if(o)o.list.push(r.left-o.x,r.top-o.y,r.right-o.x,r.bottom-o.y);
        else{const b=[r.left,r.top+sy,r.right,r.bottom+sy];for(let k=Math.floor(b[1]/128);k<=Math.floor(b[3]/128);k++){let a=rows.get(k);if(!a)rows.set(k,a=[]);a.push(b)}}}}
    this.rows=rows;this.st=[...st.values()];this.dirty=false;this.t=performance.now()},
  // measured again a quarter of a second at most after the page changes, when the browser has a moment
  tick(){if(!this.dirty||this.idle||performance.now()-this.t<250)return;if(!this.rows){this.measure();return}
    const run=()=>{this.idle=0;this.measure();Engine.kick()};this.idle=typeof requestIdleCallback!=="undefined"?requestIdleCallback(run,{timeout:400}):setTimeout(run,60)},
  draw(x,vh){if(!this.rows)return;const sy=scrollY,seen=new Set(),L=[];
    for(let k=Math.floor((sy-40)/128);k<=Math.floor((sy+vh+40)/128);k++)for(const b of this.rows.get(k)||[]){if(seen.has(b))continue;seen.add(b);L.push(b[0],b[1]-sy,b[2],b[3]-sy)}
    for(const o of this.st){if(!o.el.isConnected)continue;const r=o.el.getBoundingClientRect(),a=o.list;for(let i=0;i<a.length;i+=4){const t=a[i+1]+r.top,b=a[i+3]+r.top;if(b<-40||t>vh+40)continue;L.push(a[i]+r.left,t,a[i+2]+r.left,b)}}
    if(!L.length)return;x.fillStyle=T.bg;const rr=!!x.roundRect;
    for(const [pad,al] of [[26,.32],[15,.62],[6,.9]]){x.globalAlpha=al;x.beginPath();
      for(let i=0;i<L.length;i+=4){const X=L[i]-pad,Y=L[i+1]-pad*.75,W=L[i+2]-L[i]+2*pad,H=L[i+3]-L[i+1]+1.5*pad;if(rr)x.roundRect(X,Y,W,H,pad);else x.rect(X,Y,W,H)}x.fill()}
    x.globalAlpha=1}
};

/* ---------- the engine: draws every visible window, the stage, the floating letters and the sparks ---------- */
const scenes=new Map();   // picture address -> scene (or a promise of one)
// a figure (kind "fig") is its face, its text and its object together: `fig` = {text, target, img2}
function sceneFor(src,kind,fig){const key=kind==="fig"?[src,fig.text,fig.target,fig.img2||""].join("|"):src;let s=scenes.get(key);if(s)return s instanceof Promise?null:s;
  const p=(kind==="fig"?Promise.all([loadImg(src),loadText(fig.text||APO_URL),fig.img2?loadImg(fig.img2):null,document.fonts?document.fonts.ready:null]).then(([im,tx,im2])=>im&&tx.raw?FigScene(im,tx,fig.target,im2):null)
    :loadImg(src).then(im=>!im?null:kind==="coin"?CoinScene(im):PicScene(im))).then(sc=>{
    if(sc)scenes.set(key,sc);else scenes.delete(key);Engine.kick();return sc});
  scenes.set(key,p);return null}
const wins=new Set();     // {el,cv,cap,src,kind}
let stage=null;           // {cv,src,text,target,img2}: the figure behind the page
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
    document.addEventListener("visibilitychange",()=>this.kick());
    // the floating letters are stamped from pictures drawn in the site's own typeface: draw them again once it has come
    if(document.fonts)document.fonts.ready.then(()=>{this.flyAK="";this.kick()})},
  /** a page has opened: its windows already in view open by themselves, slowly */
  opened(){this.introT0=performance.now();readTokens();this.reclear();this.kick()},
  any(){return wins.size>0||!!stage||!!flyCv||!!fireCv||flames.length>0||Settle.items.length>0},
  kick(){if(!this.raf&&this.live&&!document.hidden&&this.any())this.raf=requestAnimationFrame(t=>this.frame(t))},
  frame(t){this.raf=0;if(!this.any()||document.hidden){this.lt=0;return}
    const el=(t-this.t0)/1000,dt=this.lt?Math.min(.05,(t-this.lt)/1000):1/60,vw=innerWidth,vh=innerHeight;
    // Balanced: at half the frame rate while nothing moves (the drifting lamp), at full rate while it does
    if(lite&&!reduce&&t-busyT>400&&FING.size===0&&t-this.lastDraw<31){this.raf=requestAnimationFrame(tt=>this.frame(tt));return}
    this.lastDraw=t;this.lt=t;tickPoints(dt);Settle.frame();
    if(stage)this.stageFrame(el,dt,vw,vh);
    if(wins.size)this.iris(el,vw,vh);
    if(flyCv)this.letters(el,vw,vh);
    if(fireCv)Fire.frame(fireCv,el,dt,vw,vh);
    if(flames.length)drawFlames(el,dt,vh);
    if(!reduce)this.raf=requestAnimationFrame(tt=>this.frame(tt));
  },
  fitCanvas(cv,w,h){const dpr=Math.min(dprCap(),devicePixelRatio||1);const W=Math.round(w*dpr),H=Math.round(h*dpr);if(cv.width!==W||cv.height!==H){cv.width=W;cv.height=H}return dpr},
  /* The figure behind the page (FigScene): its face in the opening the page marks for it ([data-face-anchor]; the first one
     shown), gathering by itself as the page opens. Once you have scrolled a little way (a fifth of the window, at most
     240 pixels), its letters become its object, grown large behind the page; back at the top (within 24 pixels of it),
     they become the face again (the owner, 2026-10-20). Each change plays through at its own pace, wherever the scroll is;
     neither starts before the face has gathered. A page opened part way down shows the object at once. In Performance
     it is drawn once in each state, and the face again only when the page moves it. */
  faceAt(){const s=stage,now=performance.now();let r=s.el&&s.el.isConnected?s.el.getBoundingClientRect():null;
    if(!r||r.height<2||now-s.elT>500){s.elT=now;s.el=null;r=null;for(const e of document.querySelectorAll("[data-face-anchor]")){const q=e.getBoundingClientRect();if(q.height>=2){s.el=e;r=q;break}}}
    return r?{x:r.left,y:r.top,w:r.width,h:r.height}:null},
  stageFrame(el,dt,vw,vh){const s=stage,sc=sceneFor(s.src,"fig",s);if(!sc)return;
    const now=performance.now(),sy=scrollY,T1=Math.min(vh*.2,240);
    // a page with no opening for the face shows only the object
    const f0=s.mv==null||s.mv<1||s.fw==null?this.faceAt():null,noFace=s.mv==null||s.mv<1||s.fw==null?!f0:s.noFace;s.noFace=noFace;
    if(s.mv==null){s.mv=s.want=sy>T1||noFace?1:0;s.g0=s.mv?now-9e3:Math.max(now,this.introT0+300);s.sp=0}
    if(sy>T1||noFace)s.want=1;else if(sy<=24)s.want=0;
    const asm=reduce?9:clamp((now-s.g0)/1000,0,9);
    if(reduce)s.mv=s.want;else if(s.want>s.mv){if(asm>=2.2)s.mv=Math.min(1,s.mv+dt/2)}else if(s.want<s.mv)s.mv=Math.max(0,s.mv-dt/1.8);
    if(!reduce&&s.mv===0&&asm>=2.2)s.sp+=dt*.1;   // the speech rises slowly through the face (only while it is a face)
    const m=s.mv*s.mv*(3-2*s.mv),cr=s.cv.getBoundingClientRect(),face=f0||{x:0,y:0,w:s.fw||Math.min(vw*.8,420),h:s.fh||Math.min(vh*.7,525)};
    s.fw=face.w;s.fh=face.h;   // (the object keeps the size the face last had, so it is not laid out again)
    if(s.veil){Veil.tick();if(!reduce&&!Veil.rows)return}
    const key=reduce?[vw,vh,cr.width,cr.height,cr.top|0,m,gen,m<1?[face.x|0,face.y|0,face.w|0,face.h|0].join():"",s.veil?Veil.t+"|"+Math.round(scrollY):""].join("|"):"";
    if(reduce&&s.drawn===key)return;s.drawn=key;
    const dpr=this.fitCanvas(s.cv,cr.width,cr.height),x=s.cv.getContext("2d");x.setTransform(1,0,0,1,0,0);x.clearRect(0,0,s.cv.width,s.cv.height);
    x.setTransform(dpr,0,0,dpr,-cr.left*dpr,-cr.top*dpr);   // drawn in the window's coordinates, wherever the canvas is
    sc.draw(x,vw,vh,el,{asm,m,off:Math.floor(s.sp*4)/4,face,still:reduce,dpr,veil:s.veil?()=>Veil.draw(x,vh):null,dim:s.dim,smax:s.smax},PTS)},
  // The windows open as a round iris centred on their picture: the coin, or another real object for each window.
  // Each plays by itself once enough of it is in view (the owner, 2026-10-19: "the animations should play automatically
  // when they come into view ... and should stay expanded, even if you scroll back up"): it opens onto the middle of the
  // picture alone, holds there a moment with a thin gold rim, then widens to the whole window, and its caption comes up
  // last. Once open, it stays open. Windows in view when the page opens wait a moment for the page to arrive.
  // A window is drawn again only when something in it changes: its iris, its place on the screen (the picture inside
  // drifts a little as the page scrolls), a pointer near it, or the coin's turning rays.
  iris(el,vw,vh){const now=performance.now();
    for(const w of wins){const r=w.el.getBoundingClientRect();if(r.bottom<0||r.top>vh||r.width<2)continue;
      const sc=sceneFor(w.src,w.kind);if(!sc)continue;
      if(w.t0==null){const seen=Math.min(r.bottom,vh)-Math.max(r.top,0);if(reduce||seen>=Math.min(r.height*.4,vh*.3))w.t0=Math.max(now,this.introT0+400)}
      const p=reduce?1:w.t0==null?0:clamp((now-w.t0)/IRIS_MS,0,1),mid=r.top+r.height/2,shift=reduce?0:(mid-vh/2)/vh*r.height*.08;
      const ptr=reduce?[]:PTS.filter(pp=>pp.x>r.left-140&&pp.x<r.right+140&&pp.y>r.top-140&&pp.y<r.bottom+140).map(pp=>({x:pp.x-r.left,y:pp.y-r.top,w:pp.w}));
      const live=p<1||ptr.length>0||(w.kind==="coin"&&!reduce),key=[Math.round(r.width),Math.round(r.height),gen,Math.round(shift*8)].join();
      if(!live&&w.drawn===key)continue;w.drawn=live?"":key;
      const cv=w.cv;const dpr=this.fitCanvas(cv,r.width,r.height);const x=cv.getContext("2d");
      x.setTransform(dpr,0,0,dpr,0,0);x.clearRect(0,0,r.width,r.height);
      const an={cx:r.width/2,cy:r.height/2-shift,w:r.width,h:r.height};
      const S=Math.min(an.w*1.2,an.h*1.05),Rc=S*.43,Rmax=Math.hypot(r.width/2,r.height/2+Math.abs(an.cy-r.height/2))+2;
      const sm=k=>k*k*(3-2*k),a=sm(clamp(p/.42,0,1)),b=sm(clamp((p-.68)/.32,0,1));
      const R=b>0?Rc+(Rmax-Rc)*b:Rc*a;
      const cap=w.cap;if(cap){const o=clamp((b-.65)/.35,0,1).toFixed(2);if(cap.style.opacity!==o)cap.style.opacity=o}
      if(R<1)continue;
      x.save();x.beginPath();x.arc(an.cx,an.cy,R,0,Math.PI*2);x.clip();
      sc.draw(x,r.width,r.height,el,p,ptr,an,w,dpr);
      x.restore();
      // the rim: a thin gold edge while the iris frames the coin, fading as it widens
      const rim=(1-b)*Math.min(1,a*1.4);if(rim>.01){
        const g=x.createRadialGradient(an.cx,an.cy,R,an.cx,an.cy,R+Math.max(10,R*.16));g.addColorStop(0,T.gold);g.addColorStop(1,"rgba(0,0,0,0)");
        x.globalAlpha=.16*rim;x.fillStyle=g;x.beginPath();x.arc(an.cx,an.cy,R+Math.max(10,R*.16),0,Math.PI*2);x.arc(an.cx,an.cy,R,0,Math.PI*2,true);x.fill();
        x.strokeStyle=T.goldHi;x.globalAlpha=.6*rim;x.lineWidth=1;x.beginPath();x.arc(an.cx,an.cy,R-.5,0,Math.PI*2);x.stroke();x.globalAlpha=1}
      // the window's frame line comes in once it is fully open
      if(b>.6){x.strokeStyle=T.gold;x.globalAlpha=.22*(b-.6)/.4;x.lineWidth=1;x.strokeRect(.5,.5,r.width-1,r.height-1);x.globalAlpha=1}}},
  // the flying letters behind the home page: few, faint and slow; they move at three speeds as you scroll, and step aside
  // from the pointer, catching a little of its light as they pass. They fade out near the page's words, so none is ever
  // drawn over a line of text (the owner, 2026-10-19: no overlaps). The lines are measured when the page opens, a few times
  // as it settles, and whenever its size changes, not on a clock; the letters are stamped from small pictures of themselves.
  flyPts:null,
  flyKey:"",flyAK:"",flyA:null,
  clear:null,clearW:0,clearDirty:true,clearTm:[],
  reclear(){this.clearDirty=true;for(const t of this.clearTm)clearTimeout(t);this.clearTm=[400,1200,3000].map(ms=>setTimeout(()=>{this.clearDirty=true;this.kick()},ms))},
  measureClear(root){const rows=new Map(),rg=document.createRange(),sy=scrollY,tw=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    for(let n;(n=tw.nextNode());){if(!n.textContent.trim())continue;rg.selectNodeContents(n);
      for(const r of rg.getClientRects()){if(r.width<3||r.height<3)continue;const b={l:r.left,r:r.right,t:r.top+sy,b:r.bottom+sy};
        for(let k=Math.floor((b.t-40)/64);k<=Math.floor((b.b+40)/64);k++){let a=rows.get(k);if(!a)rows.set(k,a=[]);a.push(b)}}}
    return rows},
  // the three sizes of floating letter, each letter drawn once in gold at the canvas's sharpness
  flyAtlas(dpr){const SZ=[10,14,21],c=document.createElement("canvas"),cell=SZ.map(s=>Math.ceil(s*1.3*dpr)),W=cell.reduce((a,b)=>a+b,0),H=Math.ceil(21*1.3*dpr);
    c.width=W;c.height=H*GL.length;const x=c.getContext("2d");x.fillStyle=T.gold;x.textBaseline="middle";x.textAlign="center";const pos=[];let X=0;
    SZ.forEach((s,z)=>{x.font=`${(s*dpr).toFixed(1)}px ${F.gentium}`;pos.push(X);for(let k=0;k<GL.length;k++)x.fillText(GL[k],X+cell[z]/2,k*H+H/2);X+=cell[z]});
    return {c,cell,pos,H,dpr}},
  letters(t,vw,vh){const cv=flyCv;if(reduce){const key=`${vw}x${vh}|${gen}|${Math.round(scrollY/24)}`;if(this.flyKey===key)return;this.flyKey=key}else this.flyKey="";
    if(!this.clear||this.clearDirty||this.clearW!==vw){this.clear=cv.parentElement?this.measureClear(cv.parentElement):new Map();this.clearDirty=false;this.clearW=vw}
    const dpr=this.fitCanvas(cv,vw,vh);const x=cv.getContext("2d");x.setTransform(dpr,0,0,dpr,0,0);x.clearRect(0,0,vw,vh);
    const ak=dpr+"|"+gen;if(this.flyAK!==ak){this.flyA=this.flyAtlas(dpr);this.flyAK=ak}const FA=this.flyA;
    const n=lite||reduce?60:120;if(!this.flyPts||this.flyPts.length!==n){this.flyPts=[];for(let k=0;k<n;k++){const z=k%3,gi=(rnd()*GL.length)|0;this.flyPts.push({u:rnd(),v:rnd()*3,z,c:GL[gi],gi,ox:0,oy:0,p:rnd()*6.3,lit:0})}this.flyPts.sort((a,b)=>a.z-b.z)}
    const SP=[.12,.3,.6],SZ=[10,14,21],AL=[.06,.1,.15],R=130;
    for(const d of this.flyPts){const z=d.z;let px=d.u*vw,py=((d.v*vh-(reduce?0:scrollY*SP[z]))%(vh*3)+vh*3)%(vh*3)-vh*.5;
      if(py<-30||py>vh+30)continue;if(!reduce){px+=Math.sin(t*.16+d.p)*6*(z+1);py+=Math.cos(t*.11+d.p)*3*(z+1)}
      if(!reduce)for(const pp of PTS){const dx=px+d.ox-pp.x,dy=py+d.oy-pp.y,dd=Math.hypot(dx,dy);
        if(dd<R){const q=(1-dd/R)*pp.w;d.ox+=dx/(dd||1)*q*(.6+z*.5);d.oy+=dy/(dd||1)*q*(.6+z*.5);d.lit=Math.max(d.lit,q)}}
      d.ox*=.95;d.oy*=.95;d.lit*=.96;
      const lx=px+d.ox,ly=py+d.oy,dy0=ly+scrollY,pad=8+SZ[z]*.6;let fade=1;
      for(const b of this.clear.get(Math.floor(dy0/64))||[]){const ex=Math.max(b.l-lx,0,lx-b.r),ey=Math.max(b.t-dy0,0,dy0-b.b),dd=Math.hypot(ex,ey);if(dd<pad){fade=Math.min(fade,dd/pad);if(!fade)break}}
      if(fade<.05)continue;
      const cw=FA.cell[z]/dpr,ch=FA.H/dpr;x.globalAlpha=Math.min(.5,AL[z]+.3*d.lit)*fade;x.drawImage(FA.c,FA.pos[z],d.gi*FA.H,FA.cell[z],FA.H,lx-cw/2,ly-ch/2,cw,ch)}
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
  function build(){const asp=img.height/img.width,w=o.height?o.height()/asp:o.width();const dpr=Math.min(2,devicePixelRatio||1);cv.width=Math.round(w*dpr);cv.height=Math.round(w*asp*dpr);cv.style.width=w+"px";cv.style.height=(w*asp)+"px";
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
    const U=o.text?o.caps:null;let n=0;
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
  let raf=0,motes=null,glyphs=null,t0=0,gone=false,pend=0,shown=false;
  function draw(t){if(!cv.isConnected)return false;const w=host.clientWidth,h=host.clientHeight;
    const fade=clamp(1-scrollY/(h*.6),0,1);host.style.setProperty("--atm",fade.toFixed(3));
    const dpr=Math.min(dprCap(),devicePixelRatio||1);if(cv.width!==Math.round(w*dpr)||cv.height!==Math.round(h*dpr)){cv.width=Math.round(w*dpr);cv.height=Math.round(h*dpr)}
    const x=cv.getContext("2d");x.setTransform(dpr,0,0,dpr,0,0);x.clearRect(0,0,w,h);shown=fade>0;
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
  // Performance: the room holds still, so scrolling only fades it (once a frame); it is drawn again only at a new size,
  // or when it comes back into view after being cleared
  const still=()=>{pend=0;if(gone||!cv.isConnected)return;const w=host.clientWidth,h=host.clientHeight,dpr=Math.min(dprCap(),devicePixelRatio||1),fade=clamp(1-scrollY/(h*.6),0,1);
    host.style.setProperty("--atm",fade.toFixed(3));if(cv.width!==Math.round(w*dpr)||cv.height!==Math.round(h*dpr)||(fade>0&&!shown))draw(0)};
  const wake=()=>{if(!raf&&!gone&&!reduce){t0=t0||performance.now();raf=requestAnimationFrame(loop)}else if(reduce&&!pend)pend=requestAnimationFrame(still)};
  addEventListener("scroll",wake,{passive:true});
  return {start,wake,stop(){gone=true;cancelAnimationFrame(raf);cancelAnimationFrame(pend);removeEventListener("scroll",wake)}};
}

/* ---------- what the site's pages call ---------- */
export function setLevel(level,motionReduced){reduce=level==="performance"||!!motionReduced;lite=level==="balanced"&&!reduce;Engine.kick()}
export function begin(){Engine.start()}
export function opened(){Engine.start();Engine.opened()}
/** a window onto an engraving: kind "coin" (Athena's head, with its rays) or "pic" (any other picture) */
export function addWindow(el,{src,kind="pic"}){Engine.start();const w={el,cv:el.querySelector("canvas"),cap:el.querySelector("[data-wcap]"),src,kind};wins.add(w);Engine.kick();return()=>{wins.delete(w)}}
/** a figure behind the page: the library's Socrates. Its face stands in the page's
 * opening marked data-face-anchor and becomes its object, grown behind the page, once you scroll; `text` is its text's
 * address (the Apology if none), `target` the object, `img2` the object's picture where it has one
 * @param {HTMLCanvasElement} cv
 * `dim` is how bright the object is behind the page (0 to 1), `smax` how many times larger than the face's box it may grow
 * @param {{src: string, text?: string, target?: string, img2?: string, veil?: boolean, dim?: number, smax?: number}} o */
export function addStage(cv,{src,text,target="roll",img2,veil=false,dim=.66,smax=3}){Engine.start();stage={cv,src,text,target,img2,veil,dim,smax};
  if(veil)Veil.attach(cv.closest("main")||document.body);Engine.kick();
  return()=>{if(stage&&stage.cv===cv){stage=null;if(veil)Veil.detach()}}}
export function addLetters(cv){Engine.start();flyCv=cv;Engine.flyPts=null;Engine.reclear();
  const ro=typeof ResizeObserver!=="undefined"&&cv.parentElement?new ResizeObserver(()=>{Engine.clearDirty=true;Engine.kick()}):null;if(ro)ro.observe(cv.parentElement);
  Engine.kick();return()=>{if(ro)ro.disconnect();if(flyCv===cv)flyCv=null}}
export function addFire(cv){Engine.start();fireCv=cv;Fire.pts=[];Engine.kick();return()=>{if(fireCv===cv)fireCv=null}}
/** one Muse's lamp: its canvas, and the element that lights up (with `litClass`) when its flame is fanned */
export function addFlame(li,cv,i,litClass){Engine.start();const f={li,cv,fan:0,lean:0,seed:i*1.73+.4,I:.3,lit:false,litClass};flames.push(f);Engine.kick();return()=>{const k=flames.indexOf(f);if(k>=0)flames.splice(k,1)}}
export function settle(el,words){Engine.start();return Settle.add(el,words)}
/** a heading whose letters the page has already set out (components/a/SettleText.tsx): only its --sp follows the scroll */
export function track(el){Engine.start();const it={el,v:-1};Settle.items.push(it);Settle.watch(it);Engine.kick();return()=>{Settle.drop(it)}}
/** the slow wheel; `points` are the places it may settle at, when settling is on
 * @param {boolean} on
 * @param {{settles?: boolean, points?: () => number[]}} [o] */
export function glide(on,{settles=false,points}={}){Glide.on_=on;Glide.settles=settles;Glide.pts=points||(()=>[]);if(!on)Glide.stop()}
/** a book's emblem, its picture drawn in letters; `text` spells it out of a text instead: true for the Apology (Socrates),
 * or a text's address */
export async function emblem(cv,src,o){Engine.start();const [img,tx]=await Promise.all([loadImg(src),o.text?loadText(typeof o.text==="string"?o.text:APO_URL):null]);if(!img||!cv.isConnected)return null;
  if(tx){if(!tx.raw)return null;o={...o,caps:capsOf(tx)}}
  if(document.fonts)await document.fonts.ready;const r=Letters(cv,img,o);r.start();return r}
export function cover(cv,host,title,isDay){Engine.start();const c=Cover(cv,host,title,isDay);c.start();return c}
export function refresh(){readTokens();Engine.kick()}
