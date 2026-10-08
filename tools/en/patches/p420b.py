import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/、今私は/g, '、今では私は');"
assert s.count(old) == 1
s = s.replace(old, "    ja = ja.replace(/、今私は/g, '、今では私は').replace(/教室を受け始め/g, '教室に通い始め').replace(/教室を受けている/g, '教室に通っている');   // started taking pottery classes → 陶芸教室に通い始めた")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
