import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = ".replace(/出来事は([^。]*?)(?:訪問者|観客|参加者)を引きつけた/g, 'イベントには$1人が訪れた')"
assert s.count(old) == 1
s = s.replace(old, ".replace(/出来事は([^。]*?)(?:訪問者|観客|参加者)を(?:引きつけ|集め)た/g, 'イベントには$1人が訪れた')")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
