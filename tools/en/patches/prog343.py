import io
p = r'C:\Claude\gokaku-navi\PROGRESS.md'
s = io.open(p, encoding='utf-8').read()
anchor = "   - 気づいた落とし穴: `node.out` の中で"
assert s.count(anchor) == 1
entry = ("   - 続き（GQ: 第 343 組、回帰 7,095 文）: **不定詞と動名詞・助動詞だけの省略**（私は窓を開けようとしたが、開けられなかった／行きたかったが、行けなかった／彼に電話しようとしたが、電話できなかった（…, but I couldn't. の省略を前の不定詞の動詞で補う。これまでは null）・"
         "残念ながら、あなたにニュースを話さなければならない（I regret to tell you + 名詞。that 節のときは これまでどおり 残念ながら、S V）・スピーチの後に、彼は続けて質問に答えた（go on to do。これまでは その後 が重なっていた））。\n")
s = s.replace(anchor, entry + anchor)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
