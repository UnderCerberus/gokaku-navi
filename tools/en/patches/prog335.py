import io
p = r'C:\Claude\gokaku-navi\PROGRESS.md'
s = io.open(p, encoding='utf-8').read()
anchor = "   - 気づいた落とし穴: `node.out` の中で"
assert s.count(anchor) == 1
entry = ("   - 続き（GI: 第 335 組、回帰 6,978 文）: **接続の表現**（最後に彼に会ったとき、彼は学生だった（The last time S V, …。これまでは null）・今度来るときは、姉を連れてきなさい（The next time）・それが彼女に会った最後だった（文頭以外の the last time は補語のまま）・"
         "聞こえるようにもっと大きな声で話しなさい／電車に乗り遅れないように（so as (not) to をトークナイザで in order (not) to に。これまでは 崩れた訳）・私がほしいのはコーヒー1杯だ・みんなが彼を好きだった（so … that の結果の節））。\n")
s = s.replace(anchor, entry + anchor)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
