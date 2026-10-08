import io
p = r'C:\Claude\gokaku-navi\PROGRESS.md'
s = io.open(p, encoding='utf-8').read()
anchor = "   - 気づいた落とし穴: `node.out` の中で"
assert s.count(anchor) == 1
entry = ("   - 続き（FG: 第 305 組、回帰 6,735 文）: **交通・通勤**（渋滞に巻き込まれた（get stuck in a traffic jam をトークナイザで stuck in traffic に。これまでは null）・年配の女性に席を譲った（give + seat。これまでは 与えた）・"
         "スピード違反で捕まった（これまでは 急ぎながらつかまえられた）・3つ目の停留所で降りなさい（これまでは 3番目の停止に）・タクシー乗り場（これまでは タクシーの売店）・京都行きの正しいプラットホーム・改札でチケットを見せてください（これまでは 門のところで））。\n")
s = s.replace(anchor, entry + anchor)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
