import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = ".replace(/長いままでいる/g, '長くいる');   // I can't stay long"
assert s.count(old) == 1
s = s.replace(old, ".replace(/長いままでい/g, '長くい');   // I can't stay long")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
