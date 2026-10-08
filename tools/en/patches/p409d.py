import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/学校(に|まで)([^、。]{0,10}?)通勤/g, '学校$1$2通学');"
assert s.count(old) == 1
s = s.replace(old, old + "\n    ja = ja.replace(/([0-9０-９]+(?:分|時間|秒|日|週間|か月|年))未満かかった/g, '$1もかからなかった');   // It took less than a minute → 1分もかからなかった")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
