import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# the small things we do every day shape who we become far more than the big decisions … → 私たちがどんな人間になるかを…はるかに形作る
# （who + 主語 + become / be（補語の who）は「どんな人間（になる）か」。後ろの far more than … は疑問詞節に入れない）
rep("""  function whClause(j, lim) {
    const t = T[j];
    if (!t || j >= lim || t.k !== 'w') return null;
    const m = mark();""",
    """  function whClause(j, lim) {
    const t = T[j];
    if (!t || j >= lim || t.k !== 'w') return null;
    const m = mark();
    if (t.w === 'who' && j > 0 && T[j - 1].k === 'w' && /^(?:shape|shapes|shaped|shaping|define|defines|defined|defining|determine|determines|determined|influence|influences|influenced|affect|affects|affected|change|changes|changed|reflect|reflects|reflected|form|forms|formed|mold|molds|molded|mould|moulds|decide|decides|decided)$/.test(T[j - 1].w) && T[j + 1] && T[j + 1].k === 'w' && PRON[T[j + 1].w] && PRON[T[j + 1].w].sub && !/^(?:it|this|that)$/.test(T[j + 1].w) && T[j + 2] && T[j + 2].k === 'w' && /^(?:are|is|am|was|were|become|becomes|became)$/.test(T[j + 2].w) &&
      (j + 3 === lim || T[j + 3].k === 'p' || /^(?:far|much|more|today|now|as|than|and|but|because)$/.test(T[j + 3].w || ''))) {
      const sjW = PRON[T[j + 1].w].ja || '';
      const becW = /^becom|^became$/.test(T[j + 2].w);
      const pastW = /^(?:was|were|became)$/.test(T[j + 2].w);
      name('indirect-q');
      return { str: sjW + 'が' + 'どんな人間' + (becW ? (pastW ? 'になったか' : 'になるか') : (pastW ? 'だったか' : 'か')), end: j + 3 };
    }""")

# 疑問詞節の目的語のあとに残った語（far more than …）は動詞の修飾として読む
rep("""        return done(vg, cw2, st, wc.end, 'SVO', o, [wc.str + (wc.isNoun ?""",
    """        return done(vg, cw2, st, wc.end < lim && /どんな人間/.test(wc.str) ? tail(wc.end, lim, st, o, vg) : wc.end, 'SVO', o, [wc.str + (wc.isNoun ?""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
