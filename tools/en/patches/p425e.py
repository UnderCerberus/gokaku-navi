import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "        if (nF && nF.end === endF && !nF.pron) return { ok: true, ja: nF.ja.replace(/^(?:約|およそ)([0-9０-９]+時(?:半|[0-9０-９]+分)?)$/, '$1ごろ')"
assert s.count(old) == 1
s = s.replace(old, "        if (nF && nF.end === endF && !nF.pron) return { ok: true, ja: nF.ja.replace(/^(?:約|およそ)([0-9０-９]+時(?:半|[0-9０-９]+分)?)$/, '$1ごろ').replace(/(読書|音楽|スポーツ|チャリティー|地域|学校)?の?出来事$/, (m0, a0) => (nF.head === 'event' ? (a0 || '') + 'イベント' : m0))")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
