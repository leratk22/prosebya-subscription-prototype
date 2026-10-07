"""Собирает video-src/intro.html из стилей и данных index.html (источник ролика приветствия)."""
import re
s=open('index.html').read()
css_all=re.search(r'<style>(.*?)</style>',s,re.S).group(1)
def between(a,b):
    i=css_all.index(a); j=css_all.index(b,i); return css_all[i:j]
css=between('@font-face','/* ---------- сцена')+between('/* ---------- карточка программы','/* ---------- шторки')
css=css.replace('url(fonts/','url(../fonts/')
icons=re.search(r'const ICONS=\{.*?\n\};',s,re.S).group(0)
specs=re.search(r'const SPECS=\[.*?\n\];',s,re.S).group(0)
def const(name):
    return re.search(r'const '+name+r'=.*?;\n',s).group(0)
helpers=''.join(const(n) for n in ['chev','infoSvg','eyeSvg'])
tpl=open('video-src/intro.tpl.html').read()
out=tpl.replace('/*CSS*/',css).replace('/*DATA*/',icons+'\n'+specs+'\n'+helpers)
open('video-src/intro.html','w').write(out)
print('ok',len(out))
