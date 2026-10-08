import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/夜の空/g, '夜空');"
assert s.count(old) == 1
s = s.replace(old, old + "\n    ja = ja.replace(/を分からな/g, 'が分からな').replace(/を分かる(?=[。、]|$)/g, 'が分かる').replace(/遊びに外出(し|す)/g, '遊びに出かけ$1').replace(/自分の(犬|ネコ|猫|子ども|赤ちゃん|息子|娘)が自分のそばで/g, '$1がそばで');   // the reason why he was angry → 理由が分からない / went out to play → 遊びに出かけた")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
