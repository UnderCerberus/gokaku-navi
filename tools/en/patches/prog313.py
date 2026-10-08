import io
p = r'C:\Claude\gokaku-navi\PROGRESS.md'
s = io.open(p, encoding='utf-8').read()
anchor = "   - 気づいた落とし穴: `node.out` の中で"
assert s.count(anchor) == 1
entry = ("   - 続き（FO: 第 313 組、回帰 6,869 文）: **規則・掲示**（図書館で話すのは禁止だ／廊下を走るのは禁止だ（No + -ing。これまでは null）・入り口で検査を受けなければならない・犬はひもにつないでおかなければならない（leash。これまでは leashの上に保た）・"
         "もう少し小さな声で話してください（これまでは 声を保って）・フラッシュ撮影はご遠慮ください・期限後の提出は受け付けられない・ここに駐車してはいけないことになっている（be not supposed to。これまでは することになっていない）・"
         "ここで列に並んでください（queue を動詞に。これまでは null）・ごみを処分してください（dispose of を熟語に。これまでは ごみの）・席は先着順で利用できる（first-come, first-served をトークナイザで 1 語に）・駅の前に自転車を置いてはいけない）。\n")
s = s.replace(anchor, entry + anchor)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
