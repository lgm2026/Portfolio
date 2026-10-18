#!/usr/bin/env python3
"""Builds docs/CONTACT_SHEET.pdf from docs/ASSET_MANIFEST.json (every shipped image, with its manifest id) and a few QA screens.
   Images are re-encoded as JPEG thumbnails first so the PDF stays small. Run: python3 tools/contact_sheet.py"""
import json, os, glob, tempfile
from PIL import Image
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch
ROOT=os.path.join(os.path.dirname(__file__),'..'); W=os.path.join(ROOT,'web'); DOCS=os.path.join(ROOT,'docs'); SH=os.path.join(ROOT,'qa','shots')
man=json.load(open(os.path.join(DOCS,'ASSET_MANIFEST.json')))
tmp=tempfile.mkdtemp()
def thumb(src,maxw,maxh,q=82):
    out=os.path.join(tmp,os.path.basename(src).rsplit('.',1)[0]+'.jpg'); im=Image.open(src).convert('RGB'); im.thumbnail((maxw,maxh)); im.save(out,quality=q); return out
def pngthumb(src,maxw):
    out=os.path.join(tmp,os.path.basename(src)); im=Image.open(src).convert('RGBA'); im.thumbnail((maxw,maxw)); im.save(out); return out
navy=(0x10/255,0x26/255,0x3D/255); brass=(0xB8/255,0x8C/255,0x35/255); cream=(0xF2/255,0xE7/255,0xCB/255)
c=canvas.Canvas(os.path.join(DOCS,'CONTACT_SHEET.pdf'),pagesize=letter); pw,ph=letter
def header(title,sub):
    c.setFillColorRGB(*navy); c.rect(0,ph-1.1*inch,pw,1.1*inch,fill=1,stroke=0)
    c.setFillColorRGB(*cream); c.setFont('Times-Bold',20); c.drawString(0.6*inch,ph-0.55*inch,title)
    c.setFillColorRGB(*brass); c.setFont('Helvetica',9); c.drawString(0.6*inch,ph-0.85*inch,sub); c.setFillColorRGB(0,0,0)
def cell(x,y,w,h,img,lines):
    c.setStrokeColorRGB(0.6,0.6,0.6); c.rect(x,y,w,h,fill=0,stroke=1)
    if img and os.path.exists(img):
        im=Image.open(img); iw,ih=im.size; k=min((w-10)/iw,(h-44)/ih); dw,dh=iw*k,ih*k
        c.drawImage(img,x+(w-dw)/2,y+h-8-dh,dw,dh,mask='auto')
    c.setFont('Helvetica-Bold',7.5); c.drawString(x+5,y+26,lines[0][:48]); c.setFont('Helvetica',6.5); c.drawString(x+5,y+16,lines[1][:60]); c.drawString(x+5,y+7,lines[2][:60])
header('HypeTeen Flight Academy r7: asset contact sheet','Every shipped image with its manifest id. Generated '+man['generated']+' from docs/ASSET_MANIFEST.json. No author name appears on any asset.')
cw,chh=1.55*inch,2.75*inch; x0,y0=0.6*inch,ph-1.4*inch-chh
for i in range(7):
    a=[m for m in man['assets'] if m['id']=='CV-0%d'%(i+1)][0]; col=i%4; row=i//4
    cell(x0+col*(cw+0.25*inch),y0-row*(chh+0.3*inch),cw,chh,thumb(os.path.join(W,a['path']),360,520),[a['id']+'  Book %d cover'%(i+1),'%s, WebP %d KB'%(a['dimensions'],a['bytes']//1024),'author line cropped; the app adds no overlay'])
ins=os.path.join(tmp,'insignia.jpg')
# the SVG marks were rasterized by the QA browser into qa/shots when available; fall back to the PNG icons
for src,out in [(os.path.join(SH,'brand_insignia.png'),'insignia.jpg'),(os.path.join(SH,'brand_icon.png'),'icon.jpg')]:
    if os.path.exists(src): thumb(src,520,480)
cell(x0+3*(cw+0.25*inch),y0-(chh+0.3*inch),cw,chh,os.path.join(tmp,'insignia.jpg'),['BR-01  Academy insignia','SVG, vector; title, Flight Bag, Hub hero','drawn in code, original'])
y2=y0-2*(chh+0.3*inch)
cell(x0,y2,cw,chh,os.path.join(tmp,'icon.jpg'),['BR-02  App icon mark','SVG + PNG 192/512/maskable/180','original'])
for j,f in enumerate(['icon-192.png','icon-maskable-512.png','apple-touch-icon.png']):
    a=[m for m in man['assets'] if m['path'].endswith(f)][0]
    cell(x0+(j+1)*(cw+0.25*inch),y2,cw,chh,pngthumb(os.path.join(W,a['path']),256),[a['id']+'  '+f,a['dimensions']+', PNG','rendered from BR-02'])
c.setFont('Helvetica',7); c.setFillColorRGB(0.3,0.3,0.3)
c.drawString(0.6*inch,0.55*inch,'Also in the manifest: FN-01..03 bundled typefaces (SIL OFL 1.1), MP-01 Natural Earth basemap (public domain), LG-01 legacy logo (not shown).')
c.drawString(0.6*inch,0.42*inch,'Icons, badges and instructional figures are drawn in code (no raster files). The 260-slot backlog is scoped in docs/ART_BACKLOG.md.')
c.showPage()
header('Page 2: the basemap and the assets in use','MP-01 (pre-projected Natural Earth) and screens where the assets appear. QA screens, phone viewport 390 px.')
shots=[('R7X_01_map.png',['MP-01 in the Explorer','map, pins, clusters','Natural Earth, public domain']),('R7X_06_library.png',['CV-01..07 on the Library shelf','real covers, typeset meta below','no author line']),('R7X_07_book7.png',['CV-07 on a book page','600x845 WebP','Book Seven']),('R7P_02_bravo_hub.png',['BR-01 in the Hub hero','insignia at 120 px','navy / brass palette'])]
sw,sh=1.7*inch,3.5*inch
for i,(f,l) in enumerate(shots):
    p=os.path.join(SH,f); cell(0.6*inch+i*(sw+0.2*inch),ph-1.4*inch-sh,sw,sh,thumb(p,700,1400,78) if os.path.exists(p) else None,l)
c.showPage(); c.save(); print('docs/CONTACT_SHEET.pdf', os.path.getsize(os.path.join(DOCS,'CONTACT_SHEET.pdf'))//1024,'KB')
