import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/^(春|夏|秋|冬)に、/, '$1には、');"
assert s.count(old) == 1
s = s.replace(old, old + "\n    ja = ja.replace(/(好き|嫌い|大好き)なようにな(る|った|って)/g, '$1にな$2');   // I came to like him → 彼が好きになった")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
