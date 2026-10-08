import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "ja = ja.replace(/([^、。]{1,8}?)が([0-9０-９]+年前)に([^、。]{0,8}?)異な(った|る)/, (m0, a0, b0, c0) => b0 + 'は' + a0 + 'が' + c0 + '違っていた')"
new = "ja = ja.replace(/([^、。は]{1,8}?)が([0-9０-９]+年前)に([^、。]{0,8}?)異な(った|る)/, (m0, a0, b0, c0) => b0 + 'は' + a0 + 'が' + c0 + '違っていた').replace(/^([^、。]{1,6}?は)([0-9０-９]+年前は)/, '$1、$2')"
assert s.count(old) == 1
s = s.replace(old, new)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
