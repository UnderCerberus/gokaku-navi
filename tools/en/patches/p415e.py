import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "        if (!T.slice(a1, b1).every((x) => (x.k === 'w' && x.cap) || isP(x, '.'))) return null;"
assert s.count(old) == 1
s = s.replace(old, "        if (!T.slice(a1, b1).every((x, k) => (x.k === 'w' && (x.cap || a1 + k === 0)) || isP(x, '.'))) return null;")
old2 = "        if (PN[T[a1].w] && !/[ァ-ヶー]$/.test(nV.ja)) return null;   // 地名（東京・京都）は呼びかけにしない"
assert s.count(old2) == 1
s = s.replace(old2, "        if (/(?:東京|大阪|京都|日本|名古屋|北海道|沖縄|横浜|神戸|奈良|広島|福岡|札幌|仙台|中国|韓国|アメリカ|イギリス|フランス|ドイツ|カナダ|オーストラリア|ロンドン|パリ|ニューヨーク|[都府県市町村国島山川湖駅])$/.test(nV.ja)) return null;   // 地名（東京・京都）は呼びかけにしない")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
