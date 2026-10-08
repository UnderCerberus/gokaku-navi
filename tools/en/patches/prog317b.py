import io
p = r'C:\Claude\gokaku-navi\PROGRESS.md'
s = io.open(p, encoding='utf-8').read()
anchor = "   - 気づいた落とし穴: `node.out` の中で"
assert s.count(anchor) == 1
entry = ("   - 続き（FT: 第 317 組の続き、回帰 6,920 文）: **内蔵長文の抜き取り確認（さらに 25 文）**（岩自体は天然磁石と呼ばれている。それは「道を導く石」を意味する古い英語の名前だ（呼ばれている + 同格。これまでは …つまり…名前と呼ばれている）・それに敬意を払って（Respect it）・"
         "1つのシステムとして連携して機能する・毎日少なくとも30分間・約1億ボルトに達することがあり、家庭の壁のコンセントの電圧よりはるかに高い（far more than that of。これまでは 電圧以上約1億ボルトにはるかに達できる）・はなみずきバス（大文字の名前 + Bus / Hotel など も の でつながない））。\n")
s = s.replace(anchor, entry + anchor)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
