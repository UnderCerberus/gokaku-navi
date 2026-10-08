import io
p = r'C:\Claude\gokaku-navi\PROGRESS.md'
s = io.open(p, encoding='utf-8').read()
anchor = "   - 気づいた落とし穴: `node.out` の中で"
assert s.count(anchor) == 1
entry = ("   - 続き（FR: 第 316 組、回帰 6,920 文）: **right の副詞用法**（すぐに行きます（I'm coming right away。これまでは すぐに来ている）・ここに座ってください（right here）・それはあそこにある（right over there。これまでは あそこに正しい）・"
         "試合の直後に疲れていた（right after + 名詞 → just after。これまでは null）・会議の直前に到着した・駅はあなたの前にある（これまでは 前に正しい）・時間どおりだ（right on time。これまでは 時間どおりに正しい）・"
         "真夜中に起こった（これまでは 権利を起こった）。強めの right（here / there / in front of / on time / in the middle など の前）はトークナイザで落とす）。\n")
s = s.replace(anchor, entry + anchor)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
