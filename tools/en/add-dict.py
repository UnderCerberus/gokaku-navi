# 辞書に見出し語を追加する（アルファベット順の位置に挿入、LF 維持、重複は飛ばす）
import io, os, re, sys
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'js', 'data') + os.sep
NEW = [
    ['unpopular', '形', '人気のない', 2],
    ['unhealthy', '形', '不健康な; 健康に悪い', 2],
    ['unequal', '形', '不平等な; 等しくない', 2],
    ['unlimited', '形', '無制限の', 2],
    ['unpredictable', '形', '予測できない', 2],
    ['unreliable', '形', '当てにならない; 信頼できない', 2],
    ['unsafe', '形', '安全でない; 危険な', 2],
    ['unstable', '形', '不安定な', 2],
    ['unsuccessful', '形', '成功しなかった; 失敗した', 2],
    ['unwilling', '形', '気が進まない', 2],
    ['inaccurate', '形', '不正確な', 2],
    ['inappropriate', '形', '不適切な', 2],
    ['incapable', '形', '〜できない; 無能な', 3],
    ['incomplete', '形', '不完全な', 2],
    ['inconvenient', '形', '不便な', 2],
    ['incorrect', '形', '間違った; 不正確な', 2],
    ['ineffective', '形', '効果のない', 2],
    ['inefficient', '形', '非効率的な', 2],
    ['irregular', '形', '不規則な', 2],
    ['irresponsible', '形', '無責任な', 2],
    ['disapprove', '動', '〜に反対する; 〜を認めない', 3],
    ['discomfort', '名', '不快感', 2],
    ['dissatisfied', '形', '不満な', 2],
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
        lines.insert(idx, "    ['%s', '%s', '%s', %d]," % (w, pos, ja, lv))
        added += 1
    io.open(p, 'w', encoding='utf-8', newline='').write('\n'.join(lines))
print('added', added)
