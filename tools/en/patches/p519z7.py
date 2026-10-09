import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "/^(?:of|cause|causes|caused|causing|prevent|prevents|prevented|reduce|reduces|reduced|see|saw|seen|cause|from|by|against|with|and)$/.test(T[j - 1].w)"
new = "/^(?:of|cause|causes|caused|causing|prevent|prevents|prevented|reduce|reduces|reduced|see|saw|seen)$/.test(T[j - 1].w)"
assert s.count(old) == 1
s = s.replace(old, new)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
