import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/([^、。はがを]{1,10})の伝統的な形(?=だ|です|。|$)/, '伝統的な$1の一形態');"
assert s.count(old) == 1
s = s.replace(old, "    ja = ja.replace(/((?:日本|中国|韓国|西洋|ヨーロッパ|インド)?の?(?:演劇|音楽|芸術|料理|舞踊|ダンス|武道|スポーツ|工芸|詩))の伝統的な形(?=だ|です|。|$)/, '伝統的な$1の一形態');")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)

old2 = "      if (t.k === 'w' && /^(?:perhaps|maybe|probably|certainly|surely|fortunately|unfortunately|actually|suddenly|finally|clearly|obviously|hopefully|luckily|sadly|interestingly|naturally|apparently|definitely|honestly|then)$/.test(t.w)"
assert s.count(old2) == 1
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
