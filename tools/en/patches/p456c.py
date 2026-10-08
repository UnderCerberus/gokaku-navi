import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "isW(x, 'and') && T[q + 1] && T[q + 1].k === 'w' && !!vc(T[q + 1], ['base']) && !nounC(T[q + 1]) && T[q + 2] && T[q + 2].k === 'w' && DET[T[q + 2].w] !== undefined && T.slice(kMd + 1, q).some((y) => isW(y, 'to'))) : -1;"
assert s.count(old) == 1
s = s.replace(old, "isW(x, 'and') && T[q + 1] && T[q + 1].k === 'w' && !!vc(T[q + 1], ['base']) && T[q + 2] && T[q + 2].k === 'w' && DET[T[q + 2].w] !== undefined && T.slice(kMd + 1, q).some((y) => isW(y, 'to'))) : -1;")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
