import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "        if (/^(?:より|最も|一番)/.test(node.ja) && !beki) return Object.assign({}, node, { ja: s + 'のに' + node.ja, end: inf.end });"
new = "        if (gap2.used && /^より多くの/.test(node.ja) && !beki) return Object.assign({}, node, { ja: s + 'もっと多くの' + node.ja.replace(/^より多くの/, ''), end: inf.end });   // more time to spend with my family → 家族と過ごすもっと多くの時間\n" + old
assert s.count(old) == 1
s = s.replace(old, new)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
