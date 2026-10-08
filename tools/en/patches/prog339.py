import io
p = r'C:\Claude\gokaku-navi\PROGRESS.md'
s = io.open(p, encoding='utf-8').read()
anchor = "   - 気づいた落とし穴: `node.out` の中で"
assert s.count(anchor) == 1
entry = ("   - 続き（GM: 第 339 組、回帰 7,030 文）: **get / take / make / turn とページ番号**（水を持ってきてくれますか（get me + 物。これまでは 水を得てくれますか）・2と3を足すと5になる／10から4を引くと6になる（Two and three make five。これまでは 2つと3つは5つを作る）・"
         "10ページを開きなさい（Turn to page ten。page の後ろの数の語をトークナイザで数字に）・教科書の32ページを開いてください・20ページから30ページまで読みなさい／10ページと11ページ（pages A to / and B））。\n")
s = s.replace(anchor, entry + anchor)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
