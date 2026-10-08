import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')"
assert s.count(old) == 1
s = s.replace(old, "    ja = ja.replace(/^私は([^、。]{0,16}?)私の(?=[^、。]{1,8}(?:について|を|に|が|で|と))/, '私は$1');   // I want to tell you about my favorite place → 私は好きな場所について（主語の 私 と重なる 私の を落とす）\n" + old)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
