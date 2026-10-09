import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "const ppJaP = isW(T[x + 1], 'in') && /興味/.test(aj.pred.plain()) && ppX.obj ? ppX.obj.ja + 'に' : ppX.ja;"
new = "const ppJaP = isW(T[x + 1], 'in') && /(?:興味|自信|関心)/.test(aj.pred.plain()) && ppX.obj ? ppX.obj.ja + 'に' : ppX.ja;"
assert s.count(old) == 1
s = s.replace(old, new)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
