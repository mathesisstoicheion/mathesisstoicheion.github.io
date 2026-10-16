"""
Prepares the pictures the torch re-lights (DESIGN.md, "Reliefs re-lit by the torch"): greyscale copies of licensed
photographs already in web/public/images, written to web/public/images/relit/ under the same names. The page reads
brightness as height, so each is greyscale with its contrast stretched; the grave stele is cut out of its grey studio
background; the books' medallions are square crops of a face or the object a text is best known for.
Credits are those of the originals (web/src/data/images.json). Needs Pillow and NumPy.

    python pipeline/relit_images.py
"""
import os
from collections import deque
from PIL import Image, ImageOps, ImageFilter
import numpy as np

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "web", "public", "images")
SRC = ROOT + "/"
OUT = os.path.join(ROOT, "relit")
os.makedirs(OUT, exist_ok=True)

def save(im, name, q=80):
    path = os.path.join(OUT, name + ".jpg")
    im.save(path, "JPEG", quality=q, optimize=True, progressive=True)
    print(name, os.path.getsize(path) // 1024, "KB")
def grey(n): return ImageOps.grayscale(Image.open(SRC + n + ".jpg").convert("RGB"))
def fit_w(im, w): return im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)

# Great Eleusinian Relief: whole relief
g=grey('great-eleusinian-relief'); g=ImageOps.autocontrast(g,cutoff=0.5); save(fit_w(g,720),'great-eleusinian-relief',78)
# Parthenon frieze cast: whole photograph (the page crops it to fit)
g=grey('parthenon-frieze-cast'); g=ImageOps.autocontrast(g,cutoff=0.5); save(fit_w(g,1400),'parthenon-frieze-cast',76)
# Grave stele: cut out from its grey studio background
g=grey('stele-woman-and-servant'); W0,H0=g.size
box=(int(.21*W0),int(.055*H0),int(.79*W0),int(.935*H0)); g=g.crop(box); g=fit_w(g,600)
a=np.asarray(g).astype(np.float32)/255.; h,w=a.shape
def X(f): return int((f*W0-box[0])/(box[2]-box[0])*w)
def Y(f): return int((f*H0-box[1])/(box[3]-box[1])*h)
m=a>0.42
# keep the threshold only above the body (pediment) and at the foot (base block); the body itself is a rectangle
zone=np.zeros_like(m); zone[:Y(.168),X(.240):X(.758)]=True; zone[Y(.885):Y(.926),X(.240):X(.758)]=True
m=m&zone
# the stele's body as a rectangle, to close gaps in the threshold mask (coordinates measured on the picture)
def X(f): return int((f*W0-box[0])/(box[2]-box[0])*w)
def Y(f): return int((f*H0-box[1])/(box[3]-box[1])*h)
m[Y(.165):Y(.915),X(.258):X(.740)]=True
# fill holes: everything not reachable from the border through background is stele
bg=np.zeros_like(m); q=deque()
for x in range(w):
    for y in (0,h-1):
        if not m[y,x]: bg[y,x]=True; q.append((y,x))
for y in range(h):
    for x in (0,w-1):
        if not m[y,x] and not bg[y,x]: bg[y,x]=True; q.append((y,x))
while q:
    y,x=q.popleft()
    for dy,dx in ((1,0),(-1,0),(0,1),(0,-1)):
        yy,xx=y+dy,x+dx
        if 0<=yy<h and 0<=xx<w and not bg[yy,xx] and not m[yy,xx]: bg[yy,xx]=True; q.append((yy,xx))
mask=Image.fromarray(((~bg)*255).astype(np.uint8)).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1.2))
mk=np.asarray(mask).astype(np.float32)/255.
s=np.clip((a-0.18)/0.72,0,1)*mk
save(Image.fromarray((s*255).astype(np.uint8)),'stele-woman-and-servant',80)
# Emblem roundels: square crops (centre x, centre y, size as a fraction of the shorter side)
C={'socrates-louvre':(0.48,0.40,0.84),'mask-of-agamemnon':(0.5,0.46,0.84),'melian-relief':(0.5,0.50,0.96),
   'pericles-bust':(0.52,0.31,0.66),'asklepios-epidaurus':(0.47,0.20,0.56),'gerome-diogenes':(0.43,0.60,0.62)}
for n,(cx,cy,f) in C.items():
    g=grey(n); w,h=g.size; S=f*min(w,h)
    g=g.crop((int(cx*w-S/2),int(cy*h-S/2),int(cx*w+S/2),int(cy*h+S/2))).resize((380,380),Image.LANCZOS)
    g=ImageOps.autocontrast(g,cutoff=0.8)
    save(g,n,80)
