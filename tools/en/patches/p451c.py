import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/^([^、。]{1,8}?)(?:たち)?の誰も/, '$1は誰も');"
assert s.count(old) == 1
s = s.replace(old, "    ja = ja.replace(/^((?:私たち|あなたたち|彼ら|彼女たち)|[^、。]{1,8}?)(?:たち)?の誰も/, '$1は誰も');")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
