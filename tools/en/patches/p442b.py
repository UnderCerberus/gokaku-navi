import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = ".replace(/速く(消|片付|処理|対応)/g, 'すばやく$1');"
assert s.count(old) == 1
s = s.replace(old, ".replace(/速く([^、。]{0,6}?)(消|片付|処理|対応)/g, 'すばやく$1$2').replace(/のそばに通り過ぎ/g, 'のそばを通り過ぎ');")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
