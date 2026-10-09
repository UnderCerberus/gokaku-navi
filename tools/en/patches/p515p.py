import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = """return rJs.indexOf('もし') >= 0 ? rJs.replace('もし', '特に') : '特に' + rJs; }; }"""
new = """return rJs.indexOf('もし') >= 0 ? rJs.replace('もし', '特に') : rJs.replace(/^(?:(?:私|彼|彼女|私たち|あなた|彼ら)は、?)?/, (m0) => m0 + '特に'); }; }"""
assert s.count(old) == 1
s = s.replace(old, new)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
