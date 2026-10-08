import io
p = r'C:\Claude\gokaku-navi\PROGRESS.md'
s = io.open(p, encoding='utf-8').read()
anchor = "   - 気づいた落とし穴: `node.out` の中で"
assert s.count(anchor) == 1
entry = ("   - 続き（GN: 第 340 組、回帰 7,047 文）: **まぎらわしい副詞・形容詞**（もうすぐ真夜中だ／もうすぐ正午だ（It's nearly midnight / almost noon。これまでは null）・もうすぐ夕食の時間だ・もうすぐ行く時間だ・もうすぐ6時だ（これまでは ほぼ6つだ）・もう正午だった・"
         "博物館は学生なら無料だ（free for students。これまでは 自由だ）・残りの学生たちは帰宅した（the rest of。これまでは 学生たちの残りは）。hard / hardly・lately / late・pretty・still・fast・free の 8 文は正しかったので回帰に固定）。\n")
s = s.replace(anchor, entry + anchor)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
