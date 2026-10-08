import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "'write back soon': '返事を待っています', 'please write back soon': '返事を待っています', "
assert s.count(old) == 1
s = s.replace(old, "'write back soon': 'すぐに返事を書いてね', ")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
