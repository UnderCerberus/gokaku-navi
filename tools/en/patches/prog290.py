import io
p = r'C:\Claude\gokaku-navi\PROGRESS.md'
s = io.open(p, encoding='utf-8').read()
anchor = "   - 気づいた落とし穴: `node.out` の中で"
assert s.count(anchor) == 1
entry = ("   - 続き（ER: 第 290 組、回帰 6,425 文）: **スポーツ・趣味**（3点差で試合に勝った／2秒差で優勝した（won by three points。これまでは 3ポイントだけ・2秒までに）・前半の終わりには同点だった（The score was tied。これまでは 結ばれた）・"
         "決勝ゴールを決めた（winning goal を辞書に。score の語義の規則は複合語の末尾も見る）・2ゴールを決めた・バスケットボールチームのキャプテン（team があるとき。船長 のまま）・彼らのチームに勝った（beat theirs）・"
         "サッカーチームに入っている（be on the team）・何時間もテレビゲームをして過ごす（spend hours）・何対何ですか（What's the score?））。\n")
s = s.replace(anchor, entry + anchor)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
