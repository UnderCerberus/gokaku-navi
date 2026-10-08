import io
p = r'C:\Claude\gokaku-navi\PROGRESS.md'
s = io.open(p, encoding='utf-8').read()
anchor = "   - 気づいた落とし穴: `node.out` の中で"
assert s.count(anchor) == 1
entry = ("   - 続き（FB: 第 300 組、回帰 6,648 文）: **体調・病院**（鼻が詰まっている・鼻水が出る・ひどいせきが出る（これまでは 悪いせきがある）・吐き気がする・少し休むべきだ（get some rest）・口を大きく開けなさい（open ~ wide。これまでは null）・"
         "病院で注射を受けた（shot。これまでは 発砲）・夕日の写真を撮った・自転車から落ちたとき（fall off。これまでは 離れて落ちた）・頭痛に効く薬はありますか・目がかゆい（itchy を辞書に）・暑さで気を失った（これまでは 熱の中で）・"
         "腰を痛めた（hurt my back。これまでは 背中を傷つけた）・脚を骨折して入院している（これまでは 壊された脚で）・血圧を測ってもらった（blood pressure を辞書に））。\n")
s = s.replace(anchor, entry + anchor)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
