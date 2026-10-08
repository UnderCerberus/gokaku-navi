import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = ".replace(/^(.+?)には世界で最も高い平均寿命の1つがある/, '$1は世界で最も平均寿命が長い国の1つだ');"
assert s.count(old) == 1
s = s.replace(old, ".replace(/^(.+?)には世界で最も高い平均寿命の1つがある/, '$1は世界で最も平均寿命が長い国の1つだ').replace(/^(.+?)には世界で最も(?:長い|高い)平均寿命がある/, '$1は世界で最も平均寿命が長い');")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
