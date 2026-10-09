import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "!isW(T[i + 1], 'of') && T.slice(i + 2).some((x) => x.k === 'w' && x.w === 'another') && !(i > 0"
new = "!isW(T[i + 1], 'of') && T.slice(i + 2).some((x, q) => x.k === 'w' && x.w === 'another' && (!T[i + 3 + q] || T[i + 3 + q].k === 'p' || T[i + 3 + q].w === T[i + 1].w)) && !(i > 0"
assert s.count(old) == 1
s = s.replace(old, new)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
