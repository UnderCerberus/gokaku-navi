import io
p = r'C:\Claude\gokaku-navi\PROGRESS.md'
s = io.open(p, encoding='utf-8').read()
anchor = "   - 気づいた落とし穴: `node.out` の中で"
assert s.count(anchor) == 1
entry = ("   - 続き（GP: 第 342 組、回帰 7,087 文）: **受け身と助動詞の意味**（彼はすぐに到着するはずだ（should + 到着など + soon は予測。これまでは 到着するべきだ）・静かにしていただけませんか／気をつけてくれますか（Could you be quiet? これまでは 静かなことができましたか）・"
         "今帰宅してもよい／私のペンを使ってもよい（you may + 動作の動詞は許可。これまでは 帰宅するかもしれない。you may be right は推量のまま）。受け身の 13 文は正しかったので回帰に固定）。\n")
s = s.replace(anchor, entry + anchor)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
