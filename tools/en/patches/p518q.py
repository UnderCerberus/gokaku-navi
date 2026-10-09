import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "[Object.assign({}, T[x + 2], { w: ppH.lemma, s: ppH.lemma })]"
new = "[Object.assign({}, T[x + 2], { w: ppH.lemma, s: ppH.lemma, an: undefined, oi: undefined })]"
assert s.count(old) == 1
s = s.replace(old, new)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
