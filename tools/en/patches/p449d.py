import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "&& T[q + 2] && T[q + 2].k === 'w' && !!vc(T[q + 2], ['base']) && !nounC(T[q + 2]) && T[q + 3] && T[q + 3].k === 'w' && DET[T[q + 3].w] !== undefined);"
assert s.count(old) == 1
s = s.replace(old, "&& T[q + 2] && T[q + 2].k === 'w' && !!vc(T[q + 2], ['base']) && T[q + 3] && T[q + 3].k === 'w' && DET[T[q + 3].w] !== undefined);")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
