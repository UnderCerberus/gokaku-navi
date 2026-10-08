# 表（FIXED_SENT / TIMEPH / LEAD2 / PN / NAME_JA）の重複キーのうち、前にあるもの（後のキーに上書きされて効いていないもの）を消す
# 動作は変わらない（オブジェクトリテラルは後のキーが勝つ）。使い方: python tools/en/fixed-dedupe.py
import io, re, os
p = os.path.join(os.path.dirname(__file__), '..', '..', 'js', 'english', 'syntax.js')
s = io.open(p, encoding='utf-8').read()
TABLES = ['FIXED_SENT', 'TIMEPH', 'LEAD2', 'PN', 'NAME_JA']
ENTRY = re.compile(r"(?:'((?:[^'\\]|\\.)*)'|\"((?:[^\"\\]|\\.)*)\"|([A-Za-z_][A-Za-z0-9_]*))\s*:\s*(?:'(?:[^'\\]|\\.)*'|\"(?:[^\"\\]|\\.)*\")\s*,?[ ]?")
removed = 0
for name in TABLES:
    i = s.find('const ' + name + ' = ')
    if i < 0:
        continue
    j = s.find('});', i)
    body = s[i:j]
    hits = {}
    for m in ENTRY.finditer(body):
        k = m.group(1) if m.group(1) is not None else (m.group(2) if m.group(2) is not None else m.group(3))
        hits.setdefault(k, []).append((m.start(), m.end()))
    cut = []
    for k, lst in hits.items():
        if len(lst) > 1:
            cut.extend(lst[:-1])
    cut.sort(reverse=True)
    for a, b in cut:
        body = body[:a] + body[b:]
    removed += len(cut)
    s = s[:i] + body + s[j:]
    print(name, 'removed', len(cut))
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('total removed', removed)
