import io
p = r'C:\Claude\gokaku-navi\PROGRESS.md'
s = io.open(p, encoding='utf-8').read()
anchor = "   - 気づいた落とし穴: `node.out` の中で"
assert s.count(anchor) == 1
entry = ("   - 続き（GO: 第 341 組、回帰 7,061 文）: **代名詞・数量の語**（私たちはみんな疲れていた（All of us。これまでは 私たちのすべては）・これらの本のどちらでもいい（Either of … will do。これまでは どちらかはするだろう）・"
         "カナダに友達が数人いる（これまでは カナダで数人の友達がいる）。mine / yours・each other・herself・each / none / some of / neither / both / anything / something の 11 文は正しかったので回帰に固定）。\n")
s = s.replace(anchor, entry + anchor)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
