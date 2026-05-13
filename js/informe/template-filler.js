// js/informe/template-filler.js
// Cargador + editor del PDF template "The Move Club" usando pdf-lib.
// Devuelve PDFDocument editable para escribir en casilleros vacíos.
//
// Uso:
//   await TPL.load();
//   const pdf = TPL.doc;
//   TPL.drawText('valor', { page:5, x:120, y:410, size:11, color:[0,1,0.48] });
//   TPL.drawImage(jpegDataUrl, { page:5, x:60, y:300, w:120, h:120 });
//   const bytes = await TPL.save();
//   TPL.download(bytes, 'informe-juan-2026.pdf');

(function(){
'use strict';

const TPL_URL = 'assets/templates/informe-move-club.pdf';

const TPL = window.TPL = {
  doc: null,
  bytes: null,
  pages: null,
  helvetica: null,
  helveticaBold: null,
  _loading: null,

  async load(){
    if (this.doc) return this.doc;
    if (this._loading) return this._loading;
    this._loading = (async () => {
      if (typeof PDFLib === 'undefined'){
        await this._loadPdfLib();
      }
      const res = await fetch(TPL_URL);
      if (!res.ok) throw new Error('Template no encontrado: ' + TPL_URL);
      this.bytes = await res.arrayBuffer();
      this.doc = await PDFLib.PDFDocument.load(this.bytes);
      this.pages = this.doc.getPages();
      this.helvetica = await this.doc.embedFont(PDFLib.StandardFonts.Helvetica);
      this.helveticaBold = await this.doc.embedFont(PDFLib.StandardFonts.HelveticaBold);
      console.log('[TPL] template cargado, páginas:', this.pages.length);
      return this.doc;
    })();
    return this._loading;
  },

  _loadPdfLib(){
    return new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js';
      s.onload = res; s.onerror = rej;
      document.head.appendChild(s);
    });
  },

  // re-clonar el documento limpio (cada generación parte del template original)
  async reset(){
    this.doc = await PDFLib.PDFDocument.load(this.bytes);
    this.pages = this.doc.getPages();
    this.helvetica = await this.doc.embedFont(PDFLib.StandardFonts.Helvetica);
    this.helveticaBold = await this.doc.embedFont(PDFLib.StandardFonts.HelveticaBold);
    return this.doc;
  },

  // dibuja texto en coords del PDF (Y desde abajo)
  drawText(txt, opt){
    const p = this.pages[opt.page]; if (!p) return;
    const { width, height } = p.getSize();
    const fontSize = opt.size || 11;
    const font = opt.bold ? this.helveticaBold : this.helvetica;
    const color = opt.color
      ? PDFLib.rgb(opt.color[0], opt.color[1], opt.color[2])
      : PDFLib.rgb(0.22, 1, 0.48);
    // si opt.fromTop true, traducir Y
    const y = opt.fromTop ? (height - opt.y) : opt.y;
    let x = opt.x;
    if (opt.align === 'center' || opt.align === 'right'){
      const w = font.widthOfTextAtSize(String(txt), fontSize);
      if (opt.align === 'center') x -= w/2;
      else x -= w;
    }
    p.drawText(String(txt), { x, y, size: fontSize, font, color });
  },

  // embed imagen (dataUrl jpg/png) en página
  async drawImage(dataUrl, opt){
    const p = this.pages[opt.page]; if (!p) return;
    const isPng = dataUrl.startsWith('data:image/png');
    const bytes = this._dataUrlToBytes(dataUrl);
    const img = isPng ? await this.doc.embedPng(bytes) : await this.doc.embedJpg(bytes);
    const { height } = p.getSize();
    const y = opt.fromTop ? (height - opt.y - opt.h) : opt.y;
    p.drawImage(img, { x: opt.x, y, width: opt.w, height: opt.h });
  },

  _dataUrlToBytes(d){
    const b64 = d.split(',')[1];
    const bin = atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i=0;i<bin.length;i++) arr[i] = bin.charCodeAt(i);
    return arr;
  },

  async save(){
    return await this.doc.save();
  },

  download(bytes, filename){
    const blob = new Blob([bytes], { type:'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename || ('informe-'+Date.now()+'.pdf');
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  },

  // helper: probar piloto con campo único
  async _testFill(text, opt){
    await this.reset();
    this.drawText(text, opt);
    const b = await this.save();
    this.download(b, 'test-template.pdf');
  }
};

})();
