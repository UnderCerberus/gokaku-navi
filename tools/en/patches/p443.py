import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = """.replace(/\\b(Sen|Minamoto|Fujiwara|Ono|Taira|Abe|Ki|Sugawara) no (Rikyu"""
assert s.count(old) == 1
s = s.replace(old, """.replace(/\\b[Tt]eachers' (?:room|office|lounge)\\b/g, 'staffroom').replace(/\\b(Sen|Minamoto|Fujiwara|Ono|Taira|Abe|Ki|Sugawara) no (Rikyu""")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
