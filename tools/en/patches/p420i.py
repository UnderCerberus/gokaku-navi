import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/^(彼|彼女|彼ら|私)はもし\\1(?:に|が)/, '$1は、もし')"
assert s.count(old) == 1, s.count(old)
s = s.replace(old, "    ja = ja.replace(/もし(雨|雪|天気|風|電車|バス)は([^、。]{1,12}?(?:たら|れば|なら)、)/g, 'もし$1が$2');   // if it doesn't rain → もし雨が降らなかったら\n" + old)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
