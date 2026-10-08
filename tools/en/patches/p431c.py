import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    if (tokens.some((x, q) => x.w === 'access' && tokens[q + 1] && tokens[q + 1].w === 'to')) ja = ja.replace(/への接近/g, 'を利用できること');"
assert s.count(old) == 1
s = s.replace(old, old + "\n    ja = ja.replace(/([^、。]{1,12}?)することで(非難|告発)され/g, '$1したとして$2され').replace(/批判的思考の(?:技術|技能|スキル)/g, '批判的思考力');   // accused of polluting the river → 川を汚染したとして非難されている / critical thinking skills → 批判的思考力")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
