# 辞書に見出し語を追加する（アルファベット順の位置に挿入、LF 維持、重複は飛ばす）
import io, os, re, sys
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'js', 'data') + os.sep
NEW = [
    ['lunch rush', '名', '昼食時の混雑', 3],
]
def key(w):
    return w.lower()
def entries(lines):
    out = []
    for i, ln in enumerate(lines):
        m = re.match(r"^    \['([^']+)', '([^']+)', ", ln)
        if m: out.append((i, m.group(1), m.group(2)))
    return out
added = 0
for fn in ['dict-a-l.js', 'dict-m-z.js']:
    p = ROOT + fn
    s = io.open(p, encoding='utf-8', newline='').read()
    assert '\r\n' not in s
    lines = s.split('\n')
    lo = 'a' if fn == 'dict-a-l.js' else 'm'
    hi = 'l' if fn == 'dict-a-l.js' else 'z'
    for w, pos, ja, lv in NEW:
        if not (lo <= w[0] <= hi): continue
        ents = entries(lines)
        if any(e[1] == w and e[2] == pos for e in ents):
            continue
        # 挿入位置: 見出し語がこの語より大きい最初のエントリの前（同じ語の別品詞があればその直後）
        same = [e for e in ents if e[1] == w]
        if same:
            idx = same[-1][0] + 1
        else:
            after = [e for e in ents if key(e[1]) > key(w)]
            idx = after[0][0] if after else ents[-1][0] + 1
        q = '"' if "'" in w else "'"
        lines.insert(idx, "    [%s%s%s, '%s', '%s', %d]," % (q, w, q, pos, ja, lv))   # good night's sleep は二重引用符
        added += 1
    io.open(p, 'w', encoding='utf-8', newline='').write('\n'.join(lines))
print('added', added)
