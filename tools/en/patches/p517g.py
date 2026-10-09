import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# 1) than those who do not → そうでない人々（関係詞節が do not だけの省略）
rep("""  function relClause(node, lim, o) {
    let j = node.end;
    if (j >= lim || !T[j] || node.clause || node.gerund || DEPTH > 4) return null;
    const m = mark();
""", """  function relClause(node, lim, o) {
    let j = node.end;
    if (j >= lim || !T[j] || node.clause || node.gerund || DEPTH > 4) return null;
    const m = mark();
    if (/^(?:who|that)$/.test(T[j].w || '') && T[j + 1] && /^(?:do|does|did)$/.test(T[j + 1].w || '') && isW(T[j + 2], 'not') && (j + 3 >= lim || T[j + 3].k === 'p')) { name('relative'); return Object.assign({}, node, { ja: 'そうでない' + node.ja, end: j + 3, rel: true }); }   // than those who do not → そうでない人々
""")
# 2) more A and B than those who … → than の後ろの名詞句は関係詞節つきも読む
rep("""              const el3 = thanEllipsis(k3 + 2, lim, sj);
              const n3 = el3 ? null : np(k3 + 2, lim, { noRel: true });""",
    """              const el3 = thanEllipsis(k3 + 2, lim, sj);
              const n3 = el3 ? null : (np(k3 + 2, lim, { noRel: !T.slice(k3 + 2, lim).some((x) => x.k === 'w' && /^(?:who|that|which)$/.test(x.w)) }));""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
