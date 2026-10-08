import io
p = r'C:\Claude\gokaku-navi\PROGRESS.md'
s = io.open(p, encoding='utf-8').read()
anchor = "   - 気づいた落とし穴: `node.out` の中で"
assert s.count(anchor) == 1
entry = ("   - 続き（FK: 第 309 組、回帰 6,800 文）: **時の表現・頻度**（1日おきに（every other day。これまでは 毎他の日）・長い間彼に会っていない（for ages。これまでは 年齢のために）・すぐに戻る（in a minute。これまでは 1分後に）・"
         "24時間ずっと開いている（around the clock。これまでは 時計の周りに）・これまでのところ（Up to now。これまでは null）・今週中に（これまでは 今今週中に。後段で 今 が重なるので translate() の最後で直す）・"
         "その間に、お茶を飲みましょう／お茶を一緒に飲んだ（have + 飲み物。これまでは 持ちましょう・持っていた））。\n")
s = s.replace(anchor, entry + anchor)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
