import io
p = r'C:\Claude\gokaku-navi\PROGRESS.md'
s = io.open(p, encoding='utf-8').read()
anchor = "   - 気づいた落とし穴: `node.out` の中で"
assert s.count(anchor) == 1
entry = ("   - 続き（GG: 第 333 組、回帰 6,951 文）: **短い答え**（はい、しました／いいえ、しませんでした（Yes, I did. これまでは はい、そうです）・はい、そうでした（Yes, it was.）・はい、あります／いいえ、ありません（Yes, there is. / No, there aren't. これまでは null）・"
         "はい、いいですよ（Yes, you may.）・いいえ、いけません（No, you must not.）・はい、そうしましょう（Yes, we should.））。\n")
s = s.replace(anchor, entry + anchor)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
