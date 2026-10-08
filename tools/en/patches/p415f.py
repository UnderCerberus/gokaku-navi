import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "'wet paint': 'ペンキ塗りたて', "
assert s.count(old) == 1
s = s.replace(old, old + "'are you okay': '大丈夫ですか', 'are you ok': '大丈夫ですか', 'is everything okay': 'すべて大丈夫ですか', ")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
