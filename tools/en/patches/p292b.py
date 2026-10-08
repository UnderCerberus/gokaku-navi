import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""    if (T[a + 1] && /^(?:is|was)$/.test(T[a + 1].w || '') && isW(T[a + 2], 'nothing') && a + 4 < b && !isW(T[a + 3], 'to') && !PREP[(T[a + 3] || {}).w] && T[a + 3].k === 'w') {
      const gNt = { type: 'np', rel: true, used: false };
      const cNt = clause(a + 3, b, { gap: gNt, sub: true });""",
    """    if (T[a + 1] && /^(?:is|was)$/.test(T[a + 1].w || '') && isW(T[a + 2], 'nothing') && a + 4 < b && !isW(T[a + 3], 'to') && !PREP[(T[a + 3] || {}).w] && T[a + 3].k === 'w') {
      const gNt = { type: 'np', rel: true, used: false };
      const kNt = /^(?:that|which)$/.test(T[a + 3].w) && a + 5 < b + 1 ? a + 4 : a + 3;   // There is nothing that I can do → できることは何もない
      const cNt = clause(kNt, b, { gap: gNt, sub: true });""")

rep("""    // Here comes the bus → ほら、バスが来た / There goes my last chance → 最後のチャンスがなくなった / Here we are → """,
    """    // There is nobody who can help us → 私たちを助けられる人は誰もいない / There is no one who doesn't know his name → 彼の名前を知らない人はいない / There are no students who like homework → 宿題が好きな生徒はいない
    if (T[a + 1] && /^(?:is|was|are|were)$/.test(T[a + 1].w || '') && (isW(T[a + 2], 'nobody') || seq(a + 2, ['no', 'one']) || (isW(T[a + 2], 'no') && T[a + 3] && T[a + 3].k === 'w' && !!nounC(T[a + 3])))) {
      const nbP = isW(T[a + 2], 'nobody') || seq(a + 2, ['no', 'one']);
      let kNb = isW(T[a + 2], 'nobody') ? a + 3 : a + 4;
      if (!nbP) { kNb = -1; for (let x = a + 4; x < b - 1 && x < a + 8; x++) if (T[x].k === 'w' && /^(?:who|that|which)$/.test(T[x].w)) { kNb = x; break; } }
      if (kNb > 0 && T[kNb] && /^(?:who|that|which)$/.test(T[kNb].w || '') && kNb + 2 <= b) {
        const mNb = mark();
        const newNb = (nbP ? [tokenize('person')[0]] : T.slice(a + 3, kNb)).concat(T.slice(kNb, b));
        const rNb = withTokens(newNb, () => { const r0 = np(0, newNb.length, {}); return r0 && r0.end === newNb.length ? r0 : null; });
        if (rNb && (!nbP || /人$/.test(rNb.ja))) {
          const negNb = T.slice(kNb + 1, b).some((x) => x.k === 'w' && /^(?:not|never)$/.test(x.w));
          const pastNb = /^(?:was|were)$/.test(T[a + 1].w);
          const anNb = nbP || !!rNb.an;
          name('there'); name('relative');
          const tailNb = (anNb ? (nbP && !negNb ? 'は誰もいな' : 'はいな') : 'はな') + (pastNb ? 'かった' : 'い');
          return { out: () => rNb.ja.replace(/(?:人々|たち)$/, (m0) => (nbP ? '' : m0)) + tailNb, sp: 'SV', past: pastNb };
        }
        fail(mNb);
      }
    }
    // Here comes the bus → ほら、バスが来た / There goes my last chance → 最後のチャンスがなくなった / Here we are → """)

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
