import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# 1) Nowadays, many people … → 近頃は、（文頭の時の副詞）
rep("""    recently: ['最近', 't'], lately: ['最近', 't'],""",
    """    recently: ['最近', 't'], lately: ['最近', 't'], nowadays: ['近頃は', 't'],""")

# 2) recognize individual human faces and remember people …（目的語の名詞句 + and + 原形は that のない節にしない）
rep("""      if (!isW(t, 'that') && /^(?:find|found|know|see|show|learn|discover|notice|realize|feel|hear|recognize|identify)$/.test(L)) { const mFo = mark(); const nFo = np(i, lim, {}); fullObj = """,
    """      if (!isW(t, 'that') && /^(?:recognize|identify|remember|recall)$/.test(L)) { const mFa = mark(); const nFa = np(i, lim, { noCoord: true }); const okFa = !!nFa && !nFa.pron && nFa.end + 1 < lim && isW(T[nFa.end], 'and') && !!vc(T[nFa.end + 1], ['base']) && !!cand(T[nFa.end - 1], '名', ['pl']); fail(mFa); if (okFa) fullObj = true; }   // recognize individual human faces and remember people → 顔を認識し、人を覚える
      if (!fullObj && !isW(t, 'that') && /^(?:find|found|know|see|show|learn|discover|notice|realize|feel|hear|recognize|identify)$/.test(L)) { const mFo = mark(); const nFo = np(i, lim, {}); fullObj = """)

# 3) He was happier and more relaxed than before → 以前より幸せで、くつろいでいた（比較級の並列 + than）
rep("""            const a3 = k3 < lim ? adjC(T[k3]) : null;
            if (a3 && (d3 || a3.form === 'comp') && (k3 + 1 === lim || T[k3 + 1].k === 'p')) {""",
    """            const a3 = k3 < lim ? adjC(T[k3]) : null;
            if (a3 && (d3 || a3.form === 'comp') && isW(T[k3 + 1], 'than') && k3 + 2 < lim) {
              const mT3 = mark();
              const el3 = thanEllipsis(k3 + 2, lim, sj);
              const n3 = el3 ? null : np(k3 + 2, lim, { noRel: true });
              if (el3 || n3) { pick(k3, a3.e); const f3 = en.jp.adj(a3.e.ja); return W(fin(P(f.te + '、' + f3.pred.s, f3.pred.cls), el3 ? lim : tail(n3.end, lim, st, o, vg), 'SVC', [(el3 || n3.ja) + 'より'])); }
              fail(mT3);
            }
            if (a3 && (d3 || a3.form === 'comp') && (k3 + 1 === lim || T[k3 + 1].k === 'p')) {""")

# 4) in some form / for some reason → 何らかの（some + 数えられる単数の名詞）
rep("""    if (/^(?:some|several)$/.test(detW) && nom.an && nom.pl && !num) det = '何人かの';""",
    """    if (/^(?:some|several)$/.test(detW) && nom.an && nom.pl && !num) det = '何人かの';
    if (detW === 'some' && !num && nom.c && !nom.pl && nom.c.form !== 'pl' && /^(?:reason|way|form|kind|sort|type|extent|degree|point|level|problem|purpose|connection|relationship|role|effect|influence|explanation|method|means|evidence|sense|idea|information|help|advantage|value|meaning)$/.test(nom.c.lemma)) det = '何らかの';   // still exists in some form → 何らかの形で""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
