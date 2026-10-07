// Рендер кадров ролика приветствия: node render.mjs <url intro.html?frames> <папка кадров> [t1,t2,...]
// Нужен puppeteer-core и Chrome. Затем ffmpeg собирает mp4 (см. README).
import puppeteer from 'puppeteer-core';
import fs from 'fs';
const [url,out,only]=process.argv.slice(2);
fs.mkdirSync(out,{recursive:true});
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new'});
const p=await b.newPage();
await p.setViewport({width:343,height:256,deviceScaleFactor:2});
await p.goto(url,{waitUntil:'networkidle0'});
await p.waitForFunction('window.READY===true');
const end=await p.evaluate('window.END');
const times=only?only.split(',').map(Number):Array.from({length:Math.round(end*30)},(_,k)=>k/30);
let n=0;
for(const t of times){
  await p.evaluate(t=>window.setT(t),t);
  await p.screenshot({path:`${out}/${only?'t'+t:String(n).padStart(4,'0')}.png`,clip:{x:0,y:0,width:343,height:256}});
  n++;
}
await b.close();
console.log('frames',n);
