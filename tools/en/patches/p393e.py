import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
for old, new in [("(?:skill|skills|ability|abilities|english|japanese|level|technique|techniques|performance|grades)$/.test(oh)) sense = { particle: 'を', core: '向上させる'", "(?:skill|skills|ability|abilities|level|technique|techniques|performance|grades)$/.test(oh)) sense = { particle: 'を', core: '向上させる'"),
                 ("|stadium|tournament|watched|watch)$/.test(x.w || ''))) ja = ja.replace(/試合/g, 'ゲーム');", "|stadium|tournament|watched|watch|tug|war|race|relay)$/.test(x.w || ''))) ja = ja.replace(/試合/g, 'ゲーム');")]:
    assert s.count(old) == 1, old[:50]
    s = s.replace(old, new)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
