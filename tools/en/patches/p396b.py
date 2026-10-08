import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')"
assert s.count(old) == 1
s = s.replace(old, "    ja = ja.replace(/引退するつもりだ/g, '引退する予定だ').replace(/([0-9０-９]+)の([^、。]{1,6}?)しか持っていない/g, '$2が$1しかない').replace(/隣に生き(る|ている)(?=。|$)/, '隣に住んでいる').replace(/隣に生きた(?=。|$)/, '隣に住んでいた');   // He is going to retire → 引退する予定だ / It has only seventeen syllables → 音節が17しかない / lives next door → 隣に住んでいる\n" + old)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
