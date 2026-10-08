import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "T[j + 3 + k] && T[j + 3 + k].k === 'w' && !!vc(T[j + 3 + k], ['base']) && !nounC(T[j + 3 + k]))) {"
new = "T[j + 3 + k] && T[j + 3 + k].k === 'w' && !!vc(T[j + 3 + k], ['base']) && DET[T[j + 3 + k].w] === undefined)) {"
assert s.count(old) == 1
s = s.replace(old, new)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
