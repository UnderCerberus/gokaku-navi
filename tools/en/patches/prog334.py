import io
p = r'C:\Claude\gokaku-navi\PROGRESS.md'
s = io.open(p, encoding='utf-8').read()
anchor = "   - 気づいた落とし穴: `node.out` の中で"
assert s.count(anchor) == 1
entry = ("   - 続き（GH: 第 334 組、回帰 6,965 文）: **疑問文**（今日は何月何日ですか／今日は何曜日ですか（これまでは 何が今日日付ですか・どんな日が今日それですか）・夏休み中にどこに行きましたか（語順）・どうやってここに来ましたか（行われる には当てない）・"
         "これはあなたのペンですか、それともマイクのものですか・ネコと犬ではどちらが好きですか（Do you like A or B?）・バスと電車のどちらで行きましたか（by A or by B））。\n")
s = s.replace(anchor, entry + anchor)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
