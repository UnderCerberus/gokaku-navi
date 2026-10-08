import io
p = r'C:\Claude\gokaku-navi\PROGRESS.md'
s = io.open(p, encoding='utf-8').read()
anchor = "   - 気づいた落とし穴: `node.out` の中で"
assert s.count(anchor) == 1
entry = ("   - 続き（FA: 第 299 組、回帰 6,624 文）: **議論・意見の表現**（言いたいことは分かるが、賛成できない・それについてはよく分からない・一理ありますね（You have a point there。これまでは そこで点がある）・言い方を変えてみましょう（これまでは それに別の方法を置かせて）・"
         "私が言いたいのは、もっと時間が必要だということだ（What I mean is。これまでは 私が意味するのは）・私の考えでは（In my view。これまでは 私の眺めでは）・私はその考えに反対だ／計画に賛成だ（be against / for。これまでは 考えに対している・計画のためのもの）・"
         "長所と短所がある・一方では（On the one hand。これまでは null）・それについては複雑な気持ちだ（これまでは 感情を混ぜた））。\n")
s = s.replace(anchor, entry + anchor)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
