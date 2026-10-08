import io
p = r'C:\Claude\gokaku-navi\js\data\dict-a-l.js'
s = io.open(p, encoding='utf-8').read()
old = "    ['artifact', '名', '人工物; 工芸品; 遺物', 3],"
assert s.count(old) == 1
s = s.replace(old, "    ['artifact', '名', '遺物; 工芸品; 人工物', 3],")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
