import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/^私は([^、。]{0,16}?)私の(?=[^、。]{1,8}(?:について|を|に|が|で|と))/, '私は$1');"
new = "    ja = ja.replace(/^私は([^。]{0,24}?)私の(?=[^、。]{1,8}(?:について|を|に|が|で|と))/, '私は$1');"
assert s.count(old) == 1
s = s.replace(old, new)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
