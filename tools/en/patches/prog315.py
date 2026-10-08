import io
p = r'C:\Claude\gokaku-navi\PROGRESS.md'
s = io.open(p, encoding='utf-8').read()
anchor = "   - 気づいた落とし穴: `node.out` の中で"
assert s.count(anchor) == 1
entry = ("   - 続き（FQ: 第 315 組、回帰 6,903 文）: **電話・会議と right now の修正**（私は今忙しい／彼は今手が離せない（これまでは 今忙しい権利だ＝形容詞 + right を名詞句に読んでいた古い不具合。right now をトークナイザで 1 語 rightnowadv にし、命令文では 今すぐ。FIXED のキーを作るときは right now に戻す）・"
         "田中さんとお話しできますか・どちら様ですか・折り返し電話をくれるよう彼に伝えていただけませんか（これまでは 彼に私に…頼んで）・あなたから電話があったことを彼に伝えておく・求人の件で電話している（job opening）・時間がなくなってきている・"
         "お話し中すみませんが、質問があります・私の邪魔をしてはいけません／邪魔された（interrupt の第一語義を 邪魔をする に。さえぎる は「をさえ」が「さえ」に縮められる置き換えに当たって を が消えていた）・さえぎる を五段に（さえぎって））。\n")
s = s.replace(anchor, entry + anchor)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
