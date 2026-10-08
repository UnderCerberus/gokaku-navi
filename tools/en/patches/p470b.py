import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = ".replace(/観光業の産業/g, '観光産業');"
assert s.count(old) == 1
s = s.replace(old, ".replace(/観光業の産業/g, '観光産業').replace(/([^、。はが]{1,8})で会談し/g, '$1について会談し').replace(/(資金|人手|食料|水|時間|睡眠)の不足/g, '$1不足');")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
