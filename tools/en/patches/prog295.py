import io
p = r'C:\Claude\gokaku-navi\PROGRESS.md'
s = io.open(p, encoding='utf-8').read()
anchor = "   - 気づいた落とし穴: `node.out` の中で"
assert s.count(anchor) == 1
entry = ("   - 続き（EW: 第 295 組、回帰 6,550 文）: **歴史・社会**（第二次世界大戦は1945年に終わった（World War II / 2 / the Second World War をトークナイザで 1 語に。これまでは 世界の戦争のII）・世界に門戸を開いた・日本国憲法は1947年に施行された（これまでは 影響の中に置かれた）・"
         "戦争で命を落とした（lose one's life。lives は熟語に当たらないので置き換え）・産業革命・大統領に選ばれた（これまでは 大統領を選出された）・1960年に独立した・漁業で生計を立てる（これまでは 釣りのそばに）・"
         "昔の人々は徒歩で旅行していた・京都へ移された・両国・彼がその人だと思う／彼女は私が愛している人だ（the one。これまでは ものだ））。\n")
s = s.replace(anchor, entry + anchor)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
