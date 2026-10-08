import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = ".replace(/遊びに外出(し|す)/g, '遊びに出かけ$1')"
assert s.count(old) == 1
s = s.replace(old, ".replace(/遊びに外出する/g, '遊びに出かける').replace(/遊びに外出し/g, '遊びに出かけ')")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
