import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    if (subj && subj.pron === 'they') cl.parts = cl.parts.map((x) => x.split('それらの').join('自分の'));"
new = "    if (subj && subj.pron === 'they' && T.some((x) => isW(x, 'their')) && !T.some((x) => isW(x, 'those'))) cl.parts = cl.parts.map((x) => x.split('それらの').join('自分の'));"
assert s.count(old) == 1
s = s.replace(old, new)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
