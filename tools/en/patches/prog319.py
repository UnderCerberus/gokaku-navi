import io
p = r'C:\Claude\gokaku-navi\PROGRESS.md'
s = io.open(p, encoding='utf-8').read()
anchor = "   - 気づいた落とし穴: `node.out` の中で"
assert s.count(anchor) == 1
entry = ("   - 続き（FV: 第 319 組、回帰 6,921 文）: **内蔵長文の抜き取り確認（さらに 30 文）**（棚の間で何時間も過ごし、ある本を数ページ読んでは、別の本を数ページ読んだ・伝言がはっきり伝わるために必ずしも言葉が必要なわけではない・一種の保険と引き換えに、時間と労力という代償を受け入れる・"
         "摂氏で測る・温度をわずかしか下げないかもしれないが、通りを目に見えて涼しくできる・それらははっきりとしたことを物語っていた・乗客を一人も乗せないことがよくある・話の主な出来事を正しい順序に並べる／語を正しい順序に並べなさい（語順））。\n")
s = s.replace(anchor, entry + anchor)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
