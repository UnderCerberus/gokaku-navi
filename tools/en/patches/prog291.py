import io
p = r'C:\Claude\gokaku-navi\PROGRESS.md'
s = io.open(p, encoding='utf-8').read()
anchor = "   - 気づいた落とし穴: `node.out` の中で"
assert s.count(anchor) == 1
entry = ("   - 続き（ES: 第 291 組、回帰 6,447 文）: **教室英語**（3人1組で活動しなさい（in groups of three。これまでは グループで3つの働きなさい）・4人ずつのグループを作りなさい・これらのプリントを後ろに回しなさい（pass ~ back、handout を辞書に）・"
         "文章を声に出して読みなさい（passage。これまでは 通路）・黒板の絵を見なさい／黒板に名前を書きなさい（board。これまでは 板の上で）・時間です（Time's up。これまでは null）・やってくれる人はいますか（Any volunteers?）・"
         "最初にやりたい人はいますか・もう一度言ってくれますか（can you の依頼に say。speak / read / write は能力の質問なので入れない）・「kaban」は英語で何と言いますか／これは日本語で何と言いますか（これまでは null）・"
         "文をノートに書き写しなさい・相手と紙を交換しなさい（swap を辞書に）・取締役会は昨日集まった（board of directors、会議体 + meet → 集まる。これまでは 監督の板は昨日交わった）・まな板で野菜を切った）。\n")
s = s.replace(anchor, entry + anchor)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
