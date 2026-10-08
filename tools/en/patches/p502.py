import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# 1) She looks more tired than her sister（look / seem / feel + more + 形容詞 + than）
rep("""        if (ap.form === 'comp' && isW(T[apEnd], 'than') && apEnd + 1 < lim) {""",
    """        if ((ap.form === 'comp' || /より$/.test(ap.deg || '')) && isW(T[apEnd], 'than') && apEnd + 1 < lim) {
          if (ap.form !== 'comp') ap.deg = ap.deg.replace(/より$/, '');   // more tired than … → …より疲れて（より は than の句に任せる）""")

# 2) It took the team almost ten years to … → チームがワクチンを開発するのにほぼ10年かかった（人でない名詞 + 期間）
rep("""      if (n1 && (n1.an || n1.pron) && !n1.dur) { who = n1; k = n1.end; }""",
    """      if (n1 && (n1.an || n1.pron || (() => { const mW = mark(); const nW = np(n1.end, b, { noRel: true, noCoord: true }); const okW = !!nW && !!nW.dur; fail(mW); return okW; })()) && !n1.dur) { who = n1; k = n1.end; }""")

# 3) the less likely they are to become sick → 病気になる可能性はますます低くなる（主語 + be + to 不定詞の後半）
rep("""      // the less qualified we may be to teach it（主語 + 助動詞 + be + to 不定詞）""",
    """      // the less likely they are to fail（主語 + be + to 不定詞）
      for (let x = k + 1; x < e - 2; x++) {
        if (!(T[x].k === 'w' && BE[T[x].w] && isW(T[x + 1], 'to'))) continue;
        const mq2 = mark();
        const sjq2 = subject(k, x);
        const infq2 = sjq2 && sjq2.end === x ? vpNonfin(x + 2, e, 'base', {}) : null;
        if (infq2 && infq2.end === e) return { adj: aj, subj: sjq2, become: false, past: /^(?:was|were)$/.test(T[x].w), inf: infq2, likely: isW(T[k - 1], 'likely') };
        fail(mq2);
      }
      // the less qualified we may be to teach it（主語 + 助動詞 + be + to 不定詞）""")
rep("""      const parts = (h2.inf ? [vpJoin(h2.inf, 'dict') + 'には'] : (h2.infGa ? [vpJoin(h2.infGa, 'dict') + 'のが'] : [])).concat(['ますます']);""",
    """      if (h2.likely && h2.inf) return { out: () => first() + vpJoin(h2.inf, 'dict') + '可能性はますます' + (h2.less ? '低くなる' : '高くなる'), sp: 'SV', end: b };   // the less likely they are to … → 〜する可能性はますます低くなる
      const parts = (h2.inf ? [vpJoin(h2.inf, 'dict') + 'には'] : (h2.infGa ? [vpJoin(h2.infGa, 'dict') + 'のが'] : [])).concat(['ますます']);""")

# 4) volunteers from all over the country → 全国からのボランティア（名詞にかかる from all over ~）
rep("""    let obj = null;
    if (j + 3 < lim && seq(j, ['the', 'fact', 'that'])) {""",
    """    if (key === 'from' && seq(j, ['all', 'over']) && j + 2 < lim) {
      const mAo = mark();
      const nAo = np(j + 2, lim, { noRel: true, noCoord: true });
      if (nAo) { const aoJ = nAo.ja === '国' ? '全国' : (/^(?:世界|日本|町|市|地域|国中)$/.test(nAo.ja) ? nAo.ja + '中' : nAo.ja + 'の各地'); return { ja: aoJ + 'から', adn: aoJ + 'からの', end: nAo.end, kind: 'other', prep: 'from', obj: nAo }; }   // volunteers from all over the country → 全国からのボランティア
      fail(mAo);
    }
    let obj = null;
    if (j + 3 < lim && seq(j, ['the', 'fact', 'that'])) {""")

# 5) the night before / the day before / for most of the year（時の決まり文句）
rep("""'without thinking': '何も考えずに', """,
    """'without thinking': '何も考えずに', 'the night before': '前の晩', 'the day before': '前日', 'the week before': '前の週', 'the year before': '前年', 'for most of the year': '1年の大半', 'most of the year': '1年の大半', 'for most of the day': '1日の大半', 'throughout our lives': '生涯を通じて', 'throughout their lives': '生涯を通じて', 'throughout his life': '生涯を通じて', 'throughout her life': '生涯を通じて', """)

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
