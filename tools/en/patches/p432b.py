import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "|| /(?:得意|苦手|好き|嫌い|好む|信じ|思う|考え)/.test(sc.pred.plain()))) return S('attr', false) + '一方で、';"
assert s.count(old) == 1
s = s.replace(old, "|| /(?:得意|苦手|好き|嫌い|好む|信じ|思う|考え)/.test(sc.pred.plain()) || T.some((x, q) => x.k === 'w' && x.w === 'also' && q > (sc.end || 0)))) return S('attr', false) + '一方で、';   // While remote work offers greater flexibility, it also presents new challenges → …を提供する一方で、")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
