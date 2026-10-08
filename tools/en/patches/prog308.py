import io
p = r'C:\Claude\gokaku-navi\PROGRESS.md'
s = io.open(p, encoding='utf-8').read()
anchor = "   - 気づいた落とし穴: `node.out` の中で"
assert s.count(anchor) == 1
entry = ("   - 続き（FJ: 第 308 組、回帰 6,781 文）: **句動詞・留守中の依頼**（私がいない間、私の犬の世話をしていただけませんか（look after + while。疑問文の後ろの節を切るとき、look after の after を接続詞と見ない。これまでは null）・あなたが留守の間（これまでは 留守である間に）・"
         "私が休暇中の間、私のネコにえさをやってくれますか（can you の依頼に feed / water / look / watch など。これまでは 休暇の上にいる間に…やれますか）・休暇中だ／出張中だ（これまでは 休暇の上にいる・事業の旅行の上にいる）・"
         "車を取ってくる間・かばんを見ていてくれますか（ピアノを弾けますか は能力のまま））。\n")
s = s.replace(anchor, entry + anchor)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
