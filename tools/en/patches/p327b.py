import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "'計算機を使わせる前に、まず計算機なしで問題を解かせる先生もいる')"
n = s.count(old)
assert n >= 1, n
# translate() の連鎖（今今 の後ろ）にあるものだけに足す
anchor = ".replace(/今今(週|月|年)/g, '今$1')"
i = s.find(anchor)
assert i > 0
j = s.find(old, i)
assert j > 0
j += len(old)
s = s[:j] + ".replace(/^パイロットは今定期的に手動で操縦するように促されて/, '今では、パイロットは定期的に手で操縦するよう勧められており')" + s[j:]
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
