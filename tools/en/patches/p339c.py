import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = """.replace(/\\b[Pp]ages (\\d+) (?:to|through) (\\d+)\\b/g, 'from page $1 to page $2')"""
assert s.count(old) == 1
s = s.replace(old, """.replace(/\\b([Pp]ages \\d+ (?:to|through|and) )(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty)\\b/g, (m0, p0, n0) => p0 + ({ one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50 })[n0])""" + old)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
