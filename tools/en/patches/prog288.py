import io
p = r'C:\Claude\gokaku-navi\PROGRESS.md'
s = io.open(p, encoding='utf-8').read()
anchor = "   - 気づいた落とし穴: `node.out` の中で"
assert s.count(anchor) == 1
entry = ("   - 続き（EP: 第 288 組、回帰 6,382 文）: **レビュー・感想の文**（それは使いやすい／それは理解しにくい（It's easy to use。to の後ろに目的語のない他動詞なら it は前の物を指す。これまでは 使うことは簡単だ。itCons では o.subj がないので it の確認は不要）・"
         "私はこれ以上ないほど幸せだ／スタッフはこれ以上ないほど親切だった（couldn't be happier / couldn't have been more helpful。これまでは もっと幸せなことができなかった）・"
         "払ったお金に見合う価値が十分にあった（worth every penny）・値段の割にお得だ（good value for money）・とてもおすすめです（Highly recommended! これまでは null）・それは必見だ（must-see）・"
         "電池はあまり長くもたない（doesn't last very long。もつ の置き換えが否定形に届いていなかった）・星5つをつける（give it five stars）・量はとても多かった（portions were huge）・"
         "結末は意外だった（surprising の述語用法）・質にがっかりした（was disappointed。これまでは 失望していた）・ニュースにショックを受けた（衝撃を与えられた）・必ずまた戻るつもりだ（definitely + will）・"
         "文末の , though は「ただ、」（これまでは もっとも、））。\n")
s = s.replace(anchor, entry + anchor)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
