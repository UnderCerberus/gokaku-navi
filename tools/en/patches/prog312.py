import io
p = r'C:\Claude\gokaku-navi\PROGRESS.md'
s = io.open(p, encoding='utf-8').read()
anchor = "   - 気づいた落とし穴: `node.out` の中で"
assert s.count(anchor) == 1
entry = ("   - 続き（FN: 第 312 組、回帰 6,849 文）: **趣味・娯楽**（映画はとても感動的だったので、私は泣いた／映画はとても感動的だった／彼のスピーチは感動的だった（moving を形容詞として辞書に。程度の副詞 + -ing の形容詞は進行形にしない。これまでは あったので、それに私を動かすことは泣いた・とても動いていた）・"
         "液体の鉄は動き続ける（形容詞にもなる -ing でも keep / stop / start などのあとは動名詞。keep + -ing を形容詞の補語にしない）・新しい都市に引っ越すこと・来週引っ越す（これまでは 来週動く）・"
         "音楽に本当に夢中だ（really into。これまでは null）・3年間ピアノをずっと習っている（これまでは 弾けるようになっている）・ホラー映画・その年の最優秀女優・映画化された・スター・ウォーズ／ハリー・ポッター を固有名詞に）。\n")
s = s.replace(anchor, entry + anchor)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
