import io
p = r'C:\Claude\gokaku-navi\PROGRESS.md'
s = io.open(p, encoding='utf-8').read()
anchor = "   - 気づいた落とし穴: `node.out` の中で"
assert s.count(anchor) == 1
entry = ("   - 続き（FU: 第 318 組、回帰 6,922 文）: **内蔵長文の抜き取り確認（さらに 30 文）**（「そして、ほら、町で一番驚いた顔をした家族がやって来た」（And here comes …! 感嘆符・and つきの here comes。これまでは …家族がここに来る）・"
         "占いをしたり、…場所を選んだりするために（to A and to B の目的）・彼らを田舎のはるか遠くへ送る・スーパーマーケットの冷たい食べ物・決して再現するのではなく、作り直すのだ（It never reproduces; it re-creates）・みちびき（Michibiki））。\n")
s = s.replace(anchor, entry + anchor)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
