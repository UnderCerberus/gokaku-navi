import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = ".replace(/([^、。]{1,10}?)ために(合意|協定|条約)に署名/g, '$1ための協定に署名')"
new = ".replace(/([^、。]{1,10}?)ために(合意|同意|協定|条約)に署名/g, '$1ための協定に署名')"
assert s.count(old) == 1
s = s.replace(old, new)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
