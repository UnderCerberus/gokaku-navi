import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# so there is less shade and less water evaporating from plants to cool the air → 日陰が少なく、空気を冷やすために植物から蒸発する水も少ない
# （there is less / fewer / more A and less / fewer / more B は別々に「Aが少なく、Bも少ない」。「より少ない日陰とより少ない水が蒸発している」にしない）
rep("""  function thereBe(a, b, o) {
    if (!(isW(T[a], 'there') || isW(T[a], 'here')) || a + 2 > b) return null;
    const m = mark();""",
    """  function thereBe(a, b, o) {
    if (!(isW(T[a], 'there') || isW(T[a], 'here')) || a + 2 > b) return null;
    const m = mark();
    if (isW(T[a], 'there') && T[a + 1] && /^(?:is|are|was|were)$/.test(T[a + 1].w || '') && /^(?:less|fewer|more)$/.test((T[a + 2] || {}).w || '')) {
      const kAl = T.findIndex((x, q) => q > a + 3 && q < b - 1 && isW(x, 'and') && /^(?:less|fewer|more)$/.test((T[q + 1] || {}).w || ''));
      if (kAl > 0) {
        const n1L = np(a + 3, kAl, { noRel: true, noCoord: true });
        const n2L = n1L && n1L.end === kAl ? np(kAl + 2, b, {}) : null;
        if (n2L && n2L.end === b) {
          const pastL = /^(?:was|were)$/.test(T[a + 1].w);
          const adjL = (w) => (w === 'more' ? '多' : '少な');
          const j1 = n1L.ja.replace(/(?:している|していた)([^、。]*)$/, 'する$1'), j2 = n2L.ja.replace(/が?(.+?)蒸発している水$/, '$1蒸発する水').replace(/している([^、。]{1,6})$/, 'する$1');
          name('there');
          const lastL = adjL(T[kAl + 1].w) + (pastL ? 'かった' : 'い');
          return { out: (y) => j1 + 'が' + adjL(T[a + 2].w) + 'く、' + j2 + (adjL(T[a + 2].w) === adjL(T[kAl + 1].w) ? 'も' : 'が') + (y && y.form === 'te' ? adjL(T[kAl + 1].w) + 'くて' : lastL), sp: 'SV', past: pastL, pred: P(lastL, 'i') };
        }
        fail(m);
      }
    }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
