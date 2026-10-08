import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/^(春|夏|秋|冬)に、/, '$1には、');"
assert s.count(old) == 1
s = s.replace(old, old + "\n    ja = ja.replace(/歯をブラシでみが/g, '歯をみが');   // brush your teeth → 歯をみがく")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
