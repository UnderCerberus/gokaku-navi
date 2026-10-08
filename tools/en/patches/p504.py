import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# 1) what life was like / what the future will be like → 生活がどんなものだったか・未来がどんなものになるか
rep("""  function whClause(j, lim) {
    const t = T[j];
    if (!t || j >= lim || t.k !== 'w') return null;
    const m = mark();""",
    """  function whClause(j, lim) {
    const t = T[j];
    if (!t || j >= lim || t.k !== 'w') return null;
    const m = mark();
    if (t.w === 'what' && lim - j >= 4 && isW(T[lim - 1], 'like')) {
      let bL = lim - 2, mdL = '';
      if (!(T[bL].k === 'w' && BE[T[bL].w])) bL = -1;
      if (bL > 0 && T[bL].w === 'be' && T[bL - 1] && T[bL - 1].k === 'w' && MODAL[T[bL - 1].w]) { mdL = T[bL - 1].w; bL--; }
      if (bL > j + 1) {
        const sjL = subject(j + 1, bL);
        if (sjL && sjL.end === bL) {
          const wasL = /^(?:was|were)$/.test(T[bL].w), futL = /^(?:will|would)$/.test(mdL);
          name('indirect-q');
          return { str: sjL.ja + 'が' + (futL ? 'どんなものになるか' : (wasL ? 'どんなものだったか' : 'どんなものか')), end: lim };   // what life was like → 生活がどんなものだったか
        }
        fail(m);
      }
    }""")

# 2) save you a lot of time → あなたの時間を大いに節約する（save + 人 + 時間・お金）
rep("""        if (L === 'show' && /^(?:way|route)$/.test(objs[1].head || '')) core = P('教える', 'v1');   // showed them the way out → 出口への道を教えた""",
    """        if (L === 'show' && /^(?:way|route)$/.test(objs[1].head || '')) core = P('教える', 'v1');   // showed them the way out → 出口への道を教えた
        if (L === 'save' && /^(?:time|money|trouble|effort|energy|lot|lots)$/.test(objs[1].head || '')) { name('svoo'); return done(vg, P('節約する', 'suru'), st, end, 'SVO', o, [objs[0].ja.replace(/^(?:私|あなた|彼|彼女|私たち|彼ら)$/, '$1の') + (/の$/.test(objs[0].ja) ? '' : (/^(?:私|あなた|彼|彼女|私たち|彼ら)$/.test(objs[0].ja) ? '' : 'の')) + objs[1].ja.replace(/^たくさんの/, '多くの') + 'を'], { noStative: true }); }   // will save you a lot of time → あなたの多くの時間を節約する""")

# 3) wrote several books on climate change（write / read + 文末までの名詞句は目的語。that のない節にしない）
rep("""      if (!fullObj && !isW(t, 'that') && /^(?:find|found|know|see|show|learn|discover|notice|realize|feel|hear|recognize|identify)$/.test(L)) { const mFo = mark();""",
    """      if (!fullObj && !isW(t, 'that') && /^(?:write|read|publish)$/.test(L) && t && t.k === 'w' && (DET[t.w] !== undefined || NUMW[t.w] !== undefined || /^(?:several|many|some|few|two|three|a|an)$/.test(t.w))) { const mWr = mark(); const nWr = np(i, lim, {}); fullObj = !!nWr && nWr.end === lim && !nWr.pron; fail(mWr); }   // wrote several books on climate change
      if (!fullObj && !isW(t, 'that') && /^(?:find|found|know|see|show|learn|discover|notice|realize|feel|hear|recognize|identify)$/.test(L)) { const mFo = mark();""")

# 4) overlook the town → 町を見下ろす / skip breakfast → 朝食を抜く
rep("""      else if (L === 'take' && !vg.passive && /^(?:message|messages)$/.test(oh)) sense = { particle: 'を', core: '預かる', tr: true };""",
    """      else if (L === 'overlook' && /(?:^| )(?:town|towns|city|sea|ocean|lake|river|valley|bay|harbor|harbour|park|garden|gardens|street|square|beach|mountains|village|port|coast)$/.test(oh)) sense = { particle: 'を', core: '見下ろす', tr: true };   // a hill overlooking the town → 町を見下ろす丘
      else if (L === 'skip' && (/(?:^| )(?:breakfast|lunch|dinner|meal|meals)$/.test(oh) || (objs[0].pron === 'it' && T.some((x) => /^(?:breakfast|lunch|dinner|meal|meals)$/.test(x.w || ''))))) sense = { particle: 'を', core: '抜く', tr: true };   // skip breakfast → 朝食を抜く
      else if (L === 'take' && !vg.passive && /^(?:message|messages)$/.test(oh)) sense = { particle: 'を', core: '預かる', tr: true };""")

# 5) all the way there → わざわざそこまで
rep("""'without thinking': '何も考えずに', """,
    """'without thinking': '何も考えずに', 'all the way there': 'わざわざそこまで', 'all the way here': 'はるばるここまで', 'on a single charge': '1回の充電で', """)

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
