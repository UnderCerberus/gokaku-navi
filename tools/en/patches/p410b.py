import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "        const n2Mn = n1Mn && n1Mn.end === kMn ? np(kMn + 2, b, {}) : null;"
new = "        let n2Mn = n1Mn && n1Mn.end === kMn ? np(kMn + 2, b, {}) : null;\n        if (n1Mn && n1Mn.end === kMn && !(n2Mn && n2Mn.end === b)) { reset(tokens); n2Mn = np(kMn + 2, b, { pp: true }); }"
assert s.count(old) == 1
s = s.replace(old, new)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
