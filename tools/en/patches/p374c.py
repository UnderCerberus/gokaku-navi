import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/([0-9０-９]+(?:時間|分)(?:間)?)毎(朝|晩|日|週|夕)/g, '毎$2$1');"
assert s.count(old) == 1
s = s.replace(old, "    if (tokens.some((x) => x.k === 'p' && x.w === '?') || tokens.some((x) => x.w === 'please') || /(?:ください|くれますか|くれませんか|いただけますか|いただけませんか)。?$/.test(ja)) ja = ja.replace(/(到着|帰宅)するとき、/, '$1したら、').replace(/家に帰るとき、/, '家に帰ったら、');   // Can you call me when you arrive? → 到着したら、電話してくれますか\n" + old)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
