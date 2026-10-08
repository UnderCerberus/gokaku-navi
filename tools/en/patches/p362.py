import io
p = r'C:\Claude\gokaku-navi\js\data\idioms.js'
s = io.open(p, encoding='utf-8').read()
for old, new in [("['gain weight', '体重が増える', 1],", "['gain weight', '太る; 体重が増える', 1],"),
                 ("['lose weight', '体重が減る', 1],", "['lose weight', 'やせる; 体重が減る', 1],")]:
    assert s.count(old) == 1, old
    s = s.replace(old, new)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)

p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/中国の万里の長城/g, '万里の長城');"
assert s.count(old) == 1
s = s.replace(old, old + """
    ja = ja.replace(/([0-9０-９.]+(?:キログラム|キロ|ポンド|kg))を得(た|る|て)/g, (m0, a0, b0) => a0 + '太' + ({ 'た': 'った', 'る': 'る', 'て': 'って' })[b0]).replace(/([0-9０-９.]+(?:キログラム|キロ|ポンド|kg))を失(った|う|って)/g, (m0, a0, b0) => a0 + 'やせ' + ({ 'った': 'た', 'う': 'る', 'って': 'て' })[b0]);   // He gained five kilograms → 5キログラム太った
    if (tokens.some((x) => /^(?:game|games|match|matches|ended|ends|end|score|race)$/.test(x.w || ''))) ja = ja.replace(/ネクタイ/g, '引き分け');   // The game ended in a tie → 試合は引き分けに終わった""")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
