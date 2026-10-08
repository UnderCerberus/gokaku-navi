import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "ja = ja.replace(/家族(?:の中)?に生まれ/g, '家庭に生まれ')"
new = "ja = ja.replace(/(?:家族|家庭)(?:の中)?に生まれ/g, '家庭に生まれ')"
assert s.count(old) == 1
s = s.replace(old, new)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
