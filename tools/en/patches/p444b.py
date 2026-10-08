import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/(?:ミスター)?氏と([^、。]{1,8}?)さん/g, '$1夫妻')"
assert s.count(old) == 1
s = s.replace(old, "    ja = ja.replace(/人々でいっぱい/g, '人でいっぱい');   // The room was full of people → 部屋は人でいっぱいだった\n" + old)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
