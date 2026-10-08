import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = """.replace(/\\bonce in a blue moon\\b/gi, 'bluemoonadv')"""
assert s.count(old) == 1
s = s.replace(old, """.replace(/\\b[Pp]ages (\\d+) (?:to|through) (\\d+)\\b/g, 'from page $1 to page $2').replace(/\\b([Pp])ages (\\d+) and (\\d+)\\b/g, '$1age $2 and page $3')""" + old)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
