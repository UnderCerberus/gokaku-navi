import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "sense = { particle: 'の中を', core: '見る', tr: true };   // Did you check the washing machine? → 洗濯機の中を見ましたか"
assert s.count(old) == 1
s = s.replace(old, "sense = { particle: 'の中を', core: '確認する', tr: true };   // Did you check the washing machine? → 洗濯機の中を確認しましたか")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
