import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "return !!mw0 && mw0.len === 2; })() && T.slice(p + 1, b).some((x) => x.k === 'w' && !!vc(x, ['3sg', 'past']) && !vc(x, ['pp']) && !nounC(x))) continue;"
assert s.count(old) == 1
s = s.replace(old, "return !!mw0 && mw0.len === 2; })() && T.slice(p + 1, b).some((x, q) => x.k === 'w' && !!vc(x, ['3sg', 'past']) && !vc(x, ['pp']) && DET[(T[p + q] || {}).w] === undefined)) continue;")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
