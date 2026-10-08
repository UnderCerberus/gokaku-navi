import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "        if (cOne > 0 && cOne + 1 < b && TIMEN[T[cOne - 1].w]) {"
assert s.count(old) == 1
s = s.replace(old, "        if (cOne > 0 && cOne + 1 < b && cOne - a >= 3 && TIMEN[T[cOne - 1].w]) {   // One evening, は既存の決まり文句（ある晩）")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
