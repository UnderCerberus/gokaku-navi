"""熟語を idioms.js のアルファベット順の位置に挿入する: python tools/en/idiom-new.py "熟語|意味|level" "熟語|意味|level" …
（同じ熟語がすでにあれば飛ばす。Bash の heredoc を使わずに熟語を足すための道具）"""
import io
import os
import re
import sys

here = os.path.dirname(os.path.abspath(__file__))
p = os.path.join(here, '..', '..', 'js', 'data', 'idioms.js')
lines = io.open(p, encoding='utf-8').read().split('\n')
pat = re.compile(r"^    \['((?:[^'\\]|\\.)*)', ")
added = 0
for arg in sys.argv[1:]:
    w, ja, lv = arg.split('|')
    key = w.lower()
    if any(pat.match(l) and pat.match(l).group(1).lower() == key for l in lines):
        print('skip (exists):', w)
        continue
    new = "    ['%s', '%s', %d]," % (w.replace("'", "\\'"), ja.replace("'", "\\'"), int(lv))
    idx = None
    last = None
    for n, l in enumerate(lines):
        m = pat.match(l)
        if not m:
            continue
        k = m.group(1).lower()
        if k[0] == '~':
            continue
        if k[0] == key[0]:
            last = n
            if k > key and idx is None:
                idx = n
    if idx is None:
        idx = (last + 1) if last is not None else None
    if idx is None:
        print('no place for', w)
        continue
    lines.insert(idx, new)
    added += 1
io.open(p, 'w', encoding='utf-8', newline='\n').write('\n'.join(lines))
print('added', added)
