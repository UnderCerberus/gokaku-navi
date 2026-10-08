import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/(帰宅|到着)(?:する|した)とき、/, '$1すると、').replace(/家に(?:帰る|帰った)とき、/, '家に帰ると、');   // When I get home, I do my homework → 帰宅すると、"
new = "    if (!tokens.some((x) => x.k === 'p' && x.w === '?') && !tokens.some((x) => /^(?:please|was|were|had|did)$/.test(x.w || ''))) ja = ja.replace(/(帰宅|到着)するとき、(?=[^。]*?(?:する|る|う|く|ぐ|す|つ|ぬ|ぶ|む)。?$)/, '$1すると、').replace(/家に帰るとき、(?=[^。]*?(?:する|る|う|く|ぐ|す|つ|ぬ|ぶ|む)。?$)/, '家に帰ると、');   // When I get home, I do my homework → 帰宅すると、（習慣の現在だけ）"
assert s.count(old) == 1
s = s.replace(old, new)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
