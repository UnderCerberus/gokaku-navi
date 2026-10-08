import io
p = r'C:\Claude\gokaku-navi\PROGRESS.md'
s = io.open(p, encoding='utf-8').read()
anchor = "   - 気づいた落とし穴: `node.out` の中で"
assert s.count(anchor) == 1
entry = ("   - 続き（GF: 第 332 組、回帰 6,939 文）: **教科書の基本文**（海外を旅行したいからだ／楽しいからだ／雨のためだ（Because … / Because of … だけの答えの文。これまでは null＝教科書でとても多い形）・あなたは毎朝何時に起きますか（これまでは 何時に毎朝）・"
         "兄弟は何人いますか（これまでは 何人の兄弟を持っていますか）・こちらは私の友達のケンだ（This is my friend, Ken. これまでは これは私の友達だ、ケン））。\n")
s = s.replace(anchor, entry + anchor)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
