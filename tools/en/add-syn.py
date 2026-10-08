"""t-syn.js の MORE 末尾に回帰文を足す: python tools/en/add-syn.py "見出しコメント" "文1|文2|…"
（プロジェクト直下で実行。同じ文がすでにあれば足さない）"""
import io
import sys

p = 'tools/en/t-syn.js'
head = sys.argv[1]
sents = [x.strip() for x in sys.argv[2].split('|') if x.strip()]
s = io.open(p, encoding='utf-8', newline='').read()
i = s.index("const MORE = [")
j = s.index("\n];", i)
body = s[i:j]


def q(x):
    if "'" in x:
        return '"' + x.replace('"', '\\"') + '"'
    return "'" + x + "'"


new = [x for x in sents if q(x) not in body]
if not new:
    print('nothing to add')
    sys.exit(0)
lines = ['  // ' + head]
cur = '  '
for x in new:
    piece = q(x) + ', '
    if len(cur) + len(piece) > 200:
        lines.append(cur.rstrip())
        cur = '  '
    cur += piece
lines.append(cur.rstrip())
block = '\n'.join(lines) + '\n'
k = j
while s[k - 1] in ' \n\r\t':
    k -= 1
if s[k - 1] != ',':
    s = s[:k] + ',' + s[k:]
    j += 1
s = s[:j + 1] + block + s[j + 1:]
io.open(p, 'w', encoding='utf-8', newline='').write(s)
print('added', len(new))
