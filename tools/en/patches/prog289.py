import io
p = r'C:\Claude\gokaku-navi\PROGRESS.md'
s = io.open(p, encoding='utf-8').read()
anchor = "   - 気づいた落とし穴: `node.out` の中で"
assert s.count(anchor) == 1
entry = ("   - 続き（EQ: 第 289 組、回帰 6,402 文）: **メール・手紙の表現**（間違いをおわびしたく、ご連絡しました／旅行についてお話ししたく／贈り物のお礼を申し上げたく／イベントが中止されたとお知らせしたく（I am writing to + 動詞を一般化。"
         "これまでは ask だけで、ほかは …ために連絡している。文全体を返さず node として返して文末の置き換えを通す＝早期 return で置き換えを飛ばす落とし穴の回避）・"
         "あなたが依頼したファイル（requested。これまでは 要請した）・近いうちにあなたに会えるのを楽しみにしている・何か質問があったら、知らせてください（let me know の 私に を省く）・"
         "遠慮なくご連絡ください／いつでも遠慮なくご連絡ください・もっと詳しい情報を送っていただけませんか・前回のメールでお伝えしたように・お元気でお過ごしのことと存じます（I hope this email finds you well）・"
         "さくら高校／みどり中学校（大文字の High School の前の名前は「の」でつながない）・ひかりビーチ）。\n")
s = s.replace(anchor, entry + anchor)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
