import io
p = r'C:\Claude\gokaku-navi\PROGRESS.md'
s = io.open(p, encoding='utf-8').read()
anchor = "   - 気づいた落とし穴: `node.out` の中で"
assert s.count(anchor) == 1
entry = ("   - 続き（FI: 第 307 組、回帰 6,766 文）: **友人関係・気持ち**（昨日けんかをしたが、今日仲直りした（have a fight を熟語に、文の途中の we made up + 時の語も 仲直り。これまでは 戦いをした・今日作った。目的語なしの make up を熟語にすると makes up 60 percent が 作る に崩れるので熟語にはしない）・"
         "いつも私の力になってくれる（be there for me）・幼稚園の頃からずっと友達だ・私をいらいらさせる（get on my nerves。これまでは 神経に乗る）・いつも私の味方をする（take my side。これまでは 側を取る））。\n")
s = s.replace(anchor, entry + anchor)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
