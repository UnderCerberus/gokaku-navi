import io
p = r'C:\Claude\gokaku-navi\PROGRESS.md'
s = io.open(p, encoding='utf-8').read()
anchor = "   - 気づいた落とし穴: `node.out` の中で"
assert s.count(anchor) == 1
entry = ("   - 続き（FP: 第 314 組、回帰 6,883 文）: **旅行の体験**（ツアーガイド・休暇でここに来ている（これまでは 休暇の上のここにいる）・どのくらい滞在する予定ですか・2週間滞在する予定だ（will be staying。今夜9時に勉強しているだろう のような時点の未来進行形は そのまま）・"
         "ホテルは予約でいっぱいだった（fully booked。これまでは 十分に予約された）・乗り継ぎ便・またそこに行くのが待ちきれない（これまでは 戻ってそこに行く））。\n")
s = s.replace(anchor, entry + anchor)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
