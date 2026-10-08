import io
p = r'C:\Claude\gokaku-navi\PROGRESS.md'
s = io.open(p, encoding='utf-8').read()
anchor = "   - 気づいた落とし穴: `node.out` の中で"
assert s.count(anchor) == 1
entry = ("   - 続き（FF: 第 304 組、回帰 6,719 文）: **家事・家庭**（洗濯物を外に干していただけませんか（これまでは 洗濯を）・家事を分担する／費用を分担した（share + housework / cost。これまでは 共有する）・服をきちんとたたんだ（これまでは きちんとして折りたたんだ）・"
         "兄は家事を決して手伝わない／料理を手伝ってくれますか（help with + 家事など。これまでは choresで助けない）・床をモップでふいた（mop を動詞として辞書に。これまでは null）・chore を辞書に）。\n")
s = s.replace(anchor, entry + anchor)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
