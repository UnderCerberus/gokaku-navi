import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "        if (kVs > 0 && kVs <= kAs + 3) {\n          const saT = tokenize('such as')"
new = "        const hdS = nounC(T[kLs - 1]), obS = T[kLs + 1] && T[kLs + 1].k === 'w' ? nounC(T[kLs + 1]) : null;\n        if (kVs > 0 && kVs <= kAs + 3 && !(hdS && isPerson(hdS) && !(obS && isPerson(obS)))) {\n          const saT = tokenize('such as')"
assert s.count(old) == 1
s = s.replace(old, new)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
