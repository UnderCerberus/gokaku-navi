import io
p = r'C:\Claude\gokaku-navi\PROGRESS.md'
s = io.open(p, encoding='utf-8').read()
anchor = "   - 気づいた落とし穴: `node.out` の中で"
assert s.count(anchor) == 1
entry = ("   - 続き（EZ: 第 298 組、回帰 6,607 文）: **倍数・分数・割合**（生徒の3分の1は学校まで歩く（One third of the students walk。分数 of ~ の数の一致を of のあとの名詞に合わせる。これまでは null）・10人中9人の生徒は試験に合格した／5人中3人は同意した（N out of M。これまでは null）・"
         "価格は以前の半分だ（half as much as before。これまでは null）・それは古いものの半分の値段だ／あれの2倍の値段だ（cost + twice / half / N times as much as。これまでは 2回あれと同じくらいがかかる）・15分が過ぎた（a quarter of an hour）・"
         "得点は80から65まで下がった（score などを drop / rise の主語に）・私は古いものがほしい（the old one。これまでは 老人に人＝the + 形容詞 = 人々 の規則を one の前では止める）・カップは壊れている（broken の状態の主語を増やす））。\n")
s = s.replace(anchor, entry + anchor)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
