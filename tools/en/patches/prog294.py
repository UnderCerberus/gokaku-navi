import io
p = r'C:\Claude\gokaku-navi\PROGRESS.md'
s = io.open(p, encoding='utf-8').read()
anchor = "   - 気づいた落とし穴: `node.out` の中で"
assert s.count(anchor) == 1
entry = ("   - 続き（EV: 第 294 組、回帰 6,528 文）: **物語の文**（王子に一目ぼれした／恋に落ちた／京都に恋をした（fall in love (with) を熟語に。これまでは 恋をして落ちた・愛に落ちた）・みんなが驚いたことに（To everyone's surprise。トークナイザで everyone's は everyone is になるのでその形もキーに。これまでは null）・"
         "ほっとしたことに・おじいさんとその妻・背の高い男性（背が高い 男性 → 背の高い）・背の高い男性が入ってきた（came in）・王は家来たちに（his men）・急いで家に帰った（hurried home）・ゆっくりだが着実に（これまでは null）・"
         "ブドウに手を伸ばそうとした・助けを求めて叫んだが、誰にも彼の声が聞こえなかった・「オオカミが来た」とうそをついた少年・中に小さい鍵を見つけた・森林から聞こえてきた・空へ飛び去った・"
         "あちこち鍵を探した（look / search + everywhere + for ~ はトークナイザで for ~ everywhere に並べ替え）・暗くなる前に／暗くなってから（before / after dark）・魔女・海賊・人魚など物語の語 15 語を辞書に・"
         "座る場所／住む場所（place・money などは「べき」をつけない）・使うお金（spend + money）。落とし穴: syntax.js の中で console や process は使えない（デバッグは throw new Error で中身を出す））。\n")
s = s.replace(anchor, entry + anchor)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
