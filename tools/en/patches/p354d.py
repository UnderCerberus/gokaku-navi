import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = """&& /(?:い|だ|である)$/.test(p.plain()) && !/(?:ない|たい|らしい|ようだ|そうだ|ここにいる|そこにいる)$/.test(p.plain()) && !/(?:ここ|そこ|あそこ|家|学校)に(?:いる|ある)$/.test(p.plain())) p = P((/い$/.test(p.plain()) ? p.plain().replace(/い$/, 'く') : p.plain().replace(/(?:だ|である)$/, 'に')) + 'なれる', 'v1');"""
new = """&& /(?:い|だ|である)$/.test(p.s || '') && !/(?:ない|たい|らしい|ようだ|そうだ)$/.test(p.s || '') && !/(?:ここ|そこ|あそこ|家|学校)に(?:いる|ある)$/.test(p.s || '')) p = P((/い$/.test(p.s) ? p.s.replace(/い$/, 'く') : p.s.replace(/(?:だ|である)$/, 'に')) + 'なれる', 'v1');"""
assert s.count(old) == 1
s = s.replace(old, new)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
