import io
p = r'C:\Claude\gokaku-navi\js\data\idioms.js'
s = io.open(p, encoding='utf-8').read()
old = "    ['be excited about ~', '〜に興奮している', 1],"
assert s.count(old) == 1
s = s.replace(old, "    ['be excited about ~', '〜にわくわくしている; 〜に興奮している', 1],")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
