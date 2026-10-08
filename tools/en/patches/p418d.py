import io
p = r'C:\Claude\gokaku-navi\js\data\dict-a-l.js'
s = io.open(p, encoding='utf-8').read()
old = "    ['leftover food', '名', '食べ残し', 3],"
assert s.count(old) == 1
s = s.replace(old, "    ['leftover food', '名', '余った食べ物; 食べ残し', 3],")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
