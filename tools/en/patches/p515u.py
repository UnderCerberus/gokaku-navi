import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "/^(?:regularly|daily|properly|carefully|correctly|safely|regularly|abroad|outdoors|online|together|alone|hard|well|frequently|every day)$/.test(T[s - 1].w)"
new = "/^(?:regularly|daily|abroad|outdoors|online|together|alone|hard|well)$/.test(T[s - 1].w)"
assert s.count(old) == 1
s = s.replace(old, new)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
