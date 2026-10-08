import io
p = r'C:\Claude\gokaku-navi\PROGRESS.md'
s = io.open(p, encoding='utf-8').read()
anchor = "   - 気づいた落とし穴: `node.out` の中で"
assert s.count(anchor) == 1
entry = ("   - 続き（FH: 第 306 組、回帰 6,748 文）: **天気・季節**（雨が降りそうだ（It looks like rain。これまでは 雨のように見える）・外は土砂降りだ・ひどく寒い（It's freezing。これまでは 冷たさを凍らせている）・梅雨に入った・去年の冬には雪がたくさん降った（これまでは 私たちは…雪がたくさんあった）・"
         "とても湿度が高かったので（humid などを天気の it に。それは を言わない）・午後ににわか雨の可能性がある（これまでは シャワーの機会）・午後に晴れた（clear up の it）・今朝は肌寒い／今朝は霧が深い（天気の it を省いた文頭の時の語に は）。"
         "落とし穴: 文頭の置き換え `^は` は「はし」「はけ口」の語頭を消す → 空の捕まえは関数で処理）。\n")
s = s.replace(anchor, entry + anchor)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
