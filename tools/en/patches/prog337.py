import io
p = r'C:\Claude\gokaku-navi\PROGRESS.md'
s = io.open(p, encoding='utf-8').read()
anchor = "   - 気づいた落とし穴: `node.out` の中で"
assert s.count(anchor) == 1
entry = ("   - 続き（GK: 第 337 組、回帰 7,002 文）: **意見文**（宿題が不必要だという意見（な + という → だという）・もし私たちがそれらを適切に使ったら、私はそれらが役に立つと思う（use them など物を扱う動詞の them と、役に立つ・便利 などの主語の they は それら）・"
         "確かにオンラインの学習は便利だが、問題もある（It is true that …, but …。これまでは …ことは本当だが、それは問題がある）・制服を着ることは（動名詞の wearing → 着ること））。回帰が 7,000 文を超えた。\n")
s = s.replace(anchor, entry + anchor)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
