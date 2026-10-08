import io
p = r'C:\Claude\gokaku-navi\PROGRESS.md'
s = io.open(p, encoding='utf-8').read()
anchor = "   - 気づいた落とし穴: `node.out` の中で"
assert s.count(anchor) == 1
entry = ("   - 続き（FE: 第 303 組、回帰 6,700 文）: **グラフ・データの説明**（博物館への訪問者の数を示す（これまでは 博物館に訪問者の数）・グラフから分かるように（これまでは あなたがグラフから見られるように）・"
         "トムだけが試験に合格した／学生の5%だけが科学を選んだ（文頭の Only + 主語は「だけが」）・この図は（figure。これまでは この数字）・折れ線グラフ／棒グラフ／円グラフを辞書に・数はピークに達した（これまでは その頂上に））。\n")
s = s.replace(anchor, entry + anchor)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
