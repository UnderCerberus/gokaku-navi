import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "!(hdS && isPerson(hdS) && !(obS && isPerson(obS)))"
new = "!(hdS && isPerson(hdS) && !(obS && isPerson(obS)) && !(T[kLs + 1] && T[kLs + 1].cap))"
assert s.count(old) == 1
s = s.replace(old, new)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
