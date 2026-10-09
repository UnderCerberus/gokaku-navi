import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "return Object.assign({}, node, { ja: 'そうでない' + node.ja, end: j + 3, rel: true }); }   // than those who do not"
new = "return Object.assign({}, node, { ja: 'そうでない' + (node.pron === 'those' || /^それら$/.test(node.ja) ? '人々' : node.ja), end: j + 3, rel: true, an: true }); }   // than those who do not"
assert s.count(old) == 1
s = s.replace(old, new)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
