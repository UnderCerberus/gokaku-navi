import io
p = r'C:\Claude\gokaku-navi\PROGRESS.md'
s = io.open(p, encoding='utf-8').read()
anchor = "   - 気づいた落とし穴: `node.out` の中で"
assert s.count(anchor) == 1
entry = ("   - 続き（GL: 第 338 組、回帰 7,016 文）: **多義の動詞**（店は多くの種類の靴を扱っている（carry の主語が店。これまでは 運ぶ）・彼が言ったことが聞き取れましたか／聞き取れなかった（catch what he said。これまでは つかまえ）・"
         "箱を上の階へ運んだ（carry ~ upstairs。これまでは 上の階の箱。the room upstairs は 上の階の部屋 のまま）。run / keep / stand / lead / lose / catch / last の 14 文は正しかったので回帰に固定）。\n")
s = s.replace(anchor, entry + anchor)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
