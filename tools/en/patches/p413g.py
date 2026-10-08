import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "ja = ja.replace(/階段を下(って|る|った)/g, (m0, a0)"
assert s.count(old) == 1
s = s.replace(old, "ja = ja.replace(/階段を下(って|る|った)(?!落|転)/g, (m0, a0)")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
