import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "        if (nCm && nCm.end === kCm) {\n          let eCm = kCm + 2;"
new = "        if (nCm && nCm.end === kCm && !(nCm.an && /^(?:first|last)$/.test(T[kCm + 1].w) && kCm + 2 === b)) {\n          let eCm = kCm + 2;"
assert s.count(old) == 1
s = s.replace(old, new)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
