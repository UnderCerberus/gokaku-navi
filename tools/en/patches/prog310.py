import io
p = r'C:\Claude\gokaku-navi\PROGRESS.md'
s = io.open(p, encoding='utf-8').read()
anchor = "   - 気づいた落とし穴: `node.out` の中で"
assert s.count(anchor) == 1
entry = ("   - 続き（FL: 第 310 組、回帰 6,815 文）: **英語のイディオム**（試験はとても簡単だった（be a piece of cake。食べた a piece of cake は ケーキを1切れ のまま）・今夜猛勉強しなければならない（hit the books）・この車は大金がかかった（cost me an arm and a leg）・"
         "ごくまれに（once in a blue moon は 5 語で TIMEPH に入らないのでトークナイザで 1 語に）・おじけづいた（get cold feet）・秘密をもらした（spill the beans）・甘いものに目がない（have a sweet tooth）・まだ決まっていない（up in the air。これまでは null）・"
         "父にとって目に入れても痛くない存在だ（the apple of her father's eye）。FIXED のキーの重複に注意（後のキーが勝つ。足す前に grep で数える））。\n")
s = s.replace(anchor, entry + anchor)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
