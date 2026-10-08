import io
p = r'C:\Claude\gokaku-navi\PROGRESS.md'
s = io.open(p, encoding='utf-8').read()
anchor = "   - 気づいた落とし穴: `node.out` の中で"
assert s.count(anchor) == 1
entry = ("   - 続き（GJ: 第 336 組、回帰 6,992 文）: **数・日付・値段と動詞＋前置詞の確認**（それは1500円だ（It costs …。これまでは 1500円かかる）・その本は300ページある・5月の第2日曜日（これまでは 2番目の日曜日）・旅行はたくさんのお金がかかる（cost a lot of money。これまでは お金の高くつく）。"
         "動詞＋前置詞の 20 文（look forward to / good at / depend on / agree with / belong to など）は正しかったので回帰に固定）。\n")
s = s.replace(anchor, entry + anchor)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
