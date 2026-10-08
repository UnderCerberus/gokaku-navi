import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "          let bodyTh = rTh.str.replace(/か$/, '');"
new = "          let bodyTh = rTh.str.replace(/か$/, '').replace(/だろう$/, '').replace(/である$/, 'だ');"
assert s.count(old) == 1
s = s.replace(old, new)
old2 = "        const nH = np(a + 2, b, { noRel: true });"
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
