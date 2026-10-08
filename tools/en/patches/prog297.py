import io
p = r'C:\Claude\gokaku-navi\PROGRESS.md'
s = io.open(p, encoding='utf-8').read()
anchor = "   - 気づいた落とし穴: `node.out` の中で"
assert s.count(anchor) == 1
entry = ("   - 続き（EY: 第 297 組、回帰 6,584 文）: **買い物・レストラン**（20%引きのセール中だ（これまでは 20%引きのためにセール中。「引き」は後段で足されるので、置き換えは「%のために」に当てる）・それをプレゼント用に包んでいただけませんか（gift-wrap を辞書に。これまでは null）・"
         "ご注文はお決まりですか・おかわりをいただけますか（refill）・窓のそばのテーブルがほしい・何かおすすめはありますか／おすすめは何ですか）。\n")
s = s.replace(anchor, entry + anchor)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
