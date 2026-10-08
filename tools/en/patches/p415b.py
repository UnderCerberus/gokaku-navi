import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')"
assert s.count(old) == 1
s = s.replace(old, "    ja = ja.replace(/興味を持つようにな(?:っている|る)人が(ますます)?(増えている|増えた|減っている)/g, '興味を持つ人が$1$2').replace(/([0-9０-９]+)歳だったとき/g, '$1歳のとき');   // More people are becoming interested in … → …に興味を持つ人が増えている / when I was ten → 10歳のとき\n" + old)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
