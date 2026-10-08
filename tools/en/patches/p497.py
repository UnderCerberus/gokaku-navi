import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# 1) He saw the accident with his own eyes: 所有格 + own の own を知覚動詞の後の原形にしない
rep("""    if (CAUS[L] && !cmpN && !(isW(tj, 'own') && isW(T[j - 1], 'her')) && tj.k === 'w'""",
    """    if (CAUS[L] && !cmpN && !(isW(tj, 'own') && /^(?:his|her|my|your|our|their|its)$/.test((T[j - 1] || {}).w || '')) && tj.k === 'w'""")
rep("""    if (t.w === 'his' && !nomNext) return { ja: '彼のもの', end: i + 1, pron: 'his' };""",
    """    if (t.w === 'his' && !nomNext && !isW(T[i + 1], 'own')) return { ja: '彼のもの', end: i + 1, pron: 'his' };   // with his own eyes の his は「彼のもの」ではない""")

# 2) turned out to be easier than I had expected → 予想していたより簡単だと分かった（補語を be の補語として読む）
rep("""      fail(mTo);
    }
    // He turned 18 last week""",
    """      fail(mTo);
      const mTb = mark();
      const vgB = Object.assign({}, vg, { lemma: 'be', e: null, passive: false, prog: false, perfect: false, modal: '', semi: '', neg: false, past: false, advs: [], idx: i + 2, end: i + 3, form: 'base' });
      const rB = parseBe(vgB, i + 3, lim, o);
      if (rB && rB.end === lim && rB.pred && !rB.cont) { name('idiom'); return done(vg, P((rB.parts || []).join('') + rB.pred.plain() + 'と分かる', 'v5'), st, lim, 'SVC', o, [], { noStative: true }); }
      fail(mTb);
    }
    // He turned 18 last week""")

# 3) Reading books increases your knowledge（文頭の -ing + 動詞にもなる複数名詞 + 動詞 → 動名詞句が主語）
rep("""    for (let p = a + 1; p < b; p++) {
      if (!verbStart(p)) continue;
""",
    """    for (let p = a + 1; p < b; p++) {
      if (!verbStart(p)) continue;
      if (p === a + 1 && T[a].k === 'w' && /ing$/.test(T[a].w) && !!vc(T[a], ['ing']) && T[p].k === 'w' && !!cand(T[p], '名', ['pl']) && p + 1 < b && T[p + 1].k === 'w' && !PRON[T[p + 1].w] && (!!vc(T[p + 1], ['3sg', 'past']) || BE[T[p + 1].w] || MODAL[T[p + 1].w])) continue;   // Reading books increases … の books は動詞にしない
""")

# 4) It is not what you say but how you say it that matters（強調構文の not A but B に wh 節）
rep("""            const nA = np(j, y, { noCoord: true });
            const nB = nA && nA.end === y ? np(y + 1, x, {}) : null;""",
    """            const nPart = (s0, e0, op) => {
              const mP = mark();
              const n0 = np(s0, e0, op);
              if (n0 && n0.end === e0) return n0;
              fail(mP);
              const w0 = T[s0] && T[s0].k === 'w' && WH[T[s0].w] ? whClause(s0, e0) : null;   // what you say / how you say it
              if (w0 && w0.end === e0) return { ja: w0.str, end: e0 };
              fail(mP);
              return null;
            };
            const nA = nPart(j, y, { noCoord: true });
            const nB = nA && nA.end === y ? nPart(y + 1, x, {}) : null;""")

# 5) leave A for B: A の終わりが for を取る動詞（look / wait …）なら、for はその動詞のもの
rep("""        if (!a || a.end + n >= lim) { fail(m); continue; }
        if (a.tooMuch) st.sugiru = true;""",
    """        if (!a || a.end + n >= lim) { fail(m); continue; }
        if (it.lit[0] === 'for' && a.end - 1 > i && T[a.end - 1].k === 'w' && /^(?:look|wait|search|ask|care|pay|apply|call|hope|prepare|account|stand|head|long|reach|go|come|run|vote)$/.test(T[a.end - 1].w)) { fail(m); continue; }   // leaving rural areas to look for work
        if (a.tooMuch) st.sugiru = true;""")

# 6) fixed の「修理された」判定: 後ろの by は別の動詞のもの（The idea that intelligence is fixed at birth has been challenged by …）
rep("""/^(?:yesterday|ago|last|soon|already|tomorrow|quickly|immediately|finally|by)$/.test(x.w || '')""",
    """/^(?:yesterday|ago|last|soon|already|tomorrow|quickly|immediately|finally)$/.test(x.w || '')""")

# 7) in childhood → 子どものころに
rep("""'without thinking': '何も考えずに', """,
    """'without thinking': '何も考えずに', 'in childhood': '子どものころに', 'in early childhood': '幼いころに', """)

# 8) all one's life / for the rest of one's life は継続（has lived here all his life → 住んでいる）
rep("""      if (fx.it && /^(?:ever since|since then)$/.test(fx.it.phrase)) st.cont = true;""",
    """      if (fx.it && /^(?:ever since|since then|all one's life|all one's lives|for the rest of one's life|for the rest of one's lives)$/.test(fx.it.phrase)) st.cont = true;""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
