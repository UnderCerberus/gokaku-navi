import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = ".replace(/([0-9０-９]+)倍(?:多かった|大きかった)/g, '$1倍だった').replace(/([0-9０-９]+)倍(?:多い|大きい)(?=。|$)/g, '$1倍だ');"
assert s.count(old) == 1
s = s.replace(old, ".replace(/(数|人数|量|価格|売上|人口|生産量|割合)は([^、。]*?)([0-9０-９]+)倍(?:多かった|大きかった)/g, '$1は$2$3倍だった').replace(/(数|人数|量|価格|売上|人口|生産量|割合)は([^、。]*?)([0-9０-９]+)倍(?:多い|大きい)(?=。|$)/g, '$1は$2$3倍だ').replace(/の([0-9０-９]+)倍大きい(?=。|$)/, 'の$1倍の大きさだ');")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
