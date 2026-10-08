import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = ".replace(/大きいコレクション/g, '大規模なコレクション');"
new = ";\n    if (tokens.some((x) => /^(?:museum|museums|library|libraries|gallery|galleries|zoo|aquarium)$/.test(x.w || ''))) ja = ja.replace(/大きいコレクション/g, '大規模なコレクション');"
assert s.count(old) == 1
s = s.replace(old, new)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
