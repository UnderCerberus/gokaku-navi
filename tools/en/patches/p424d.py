import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = ".replace(/あなたの健康に(良い|悪い)/g, '健康に$1');"
assert s.count(old) == 1
s = s.replace(old, ".replace(/あなたの健康に(良い|悪い)/g, '健康に$1').replace(/何(千|百|万)もの(訪問者|観光客|人々|人|学生|生徒|ファン|客|見物人|参加者|ボランティア)/g, '何$1人もの$2');")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
