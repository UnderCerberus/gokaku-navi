import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/知識の隙間/g, '知識の空白')"
assert s.count(old) == 1
s = s.replace(old, "    ja = ja.replace(/健康なままでい/g, '健康でい').replace(/より偉大(?:だ|である)(?=。|$)/g, 'より大きい').replace(/より偉大な/g, 'より大きな');   // helps people stay healthy → 健康でいる / the benefits are greater than the costs → 費用より大きい\n" + old)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
