import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = ": rT.ja).replace(/べきであるのは/g, 'べきなのは')"
assert s.count(old) == 1, s.count(old)
s = s.replace(old, ": rT.ja).replace(/べきであるのは/g, 'べきなのは').replace(/(東京|パリ|ロンドン|北京|リオ|長野|札幌|ロサンゼルス|シドニー|アテネ)のオリンピック/g, '$1オリンピック')")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
