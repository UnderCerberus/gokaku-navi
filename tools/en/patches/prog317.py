import io
p = r'C:\Claude\gokaku-navi\PROGRESS.md'
s = io.open(p, encoding='utf-8').read()
anchor = "   - 気づいた落とし穴: `node.out` の中で"
assert s.count(anchor) == 1
entry = ("   - 続き（FS: 第 317 組、回帰 6,920 文）: **内蔵長文の抜き取り確認（40 文）**（わらに刺されて、ボウルの水に浮かべられた（これまでは 1つのわらを通って押されて、1杯の水で）・小さい遅れはすぐに積み重なる・衛星の周りの巨大な球・"
         "熱を運び去るだけだ（simply）・電話を確認する／ニュースを確認する／答えを一緒に確認しましょう（check + phone / news / answers など。これまでは 確かめる））。\n")
s = s.replace(anchor, entry + anchor)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
