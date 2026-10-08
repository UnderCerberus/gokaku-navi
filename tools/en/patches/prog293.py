import io
p = r'C:\Claude\gokaku-navi\PROGRESS.md'
s = io.open(p, encoding='utf-8').read()
anchor = "   - 気づいた落とし穴: `node.out` の中で"
assert s.count(anchor) == 1
entry = ("   - 続き（EU: 第 293 組、回帰 6,499 文）: **関係副詞の省略・間接疑問の when・上級構文**（これは私がここに来た理由だ（the reason I came here。これまでは null）・私たちがハワイに行った時（これまでは ハワイになった時間＝目的語の穴で読んでいた。"
         "理由・時・日などの名詞 + 節は、節の最後が他動詞のときだけ穴の読みを優先）・あなたが来られない理由がありますか・"
         "彼がいつ出発したか知っていますか／次のバスがいつ来るか教えてくれますか（疑問文の後ろの when を、know / tell me の後なら副詞節に切らない。これまでは 出発したとき、あなたは知っていますか）・"
         "どのバスに乗るべきか（which bus to take）・彼は天才だと言っても過言ではない（これまでは null）・試験の後になって初めて（Only after + 名詞 did …。これまでは null）・"
         "助けてくれる友達がたくさんいる／助けてくれる人が誰もいない（friends to help him：不定詞の目的語の代名詞が文の主語なら、名詞は不定詞の主語）・"
         "彼が挙げた理由／私が乗ったバス／犯した間違い（関係詞の穴が目的語のとき先行詞で語義を選ぶ）・理由は分かっていない（unknown））。\n")
s = s.replace(anchor, entry + anchor)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
