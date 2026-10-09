import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Ken prefers to stay indoors and read: 3 単現の主語 + 現在の動詞のときは、過去形と同形の原形（read / put / cut …）も不定詞の並列に入れて全体を読み直す
rep("""            const mw2 = mark();
            const whole2 = clause(a, b, o);
            if (whole2) return wrap(whole2);
            fail(mw2);""",
    """            const mw2 = mark();
            let whole2 = null;
            INF_AMB = true;
            try { whole2 = clause(a, b, o); } finally { INF_AMB = false; }
            if (whole2) return wrap(whole2);
            fail(mw2);""")
rep("""&& !(/^(?:tend|seem|appear|happen)$/.test(T[vp.end + 1].w) && isW(T[vp.end + 2], 'to')) && !vc(T[vp.end + 1], ['past', '3sg']) && !(o && o.noInfCoord)) {""",
    """&& !(/^(?:tend|seem|appear|happen)$/.test(T[vp.end + 1].w) && isW(T[vp.end + 2], 'to')) && (!vc(T[vp.end + 1], ['past', '3sg']) || (INF_AMB && !vc(T[vp.end + 1], ['3sg']))) && !(o && o.noInfCoord)) {""")
rep("""  let Q_DEPTH = 0;""",
    """  let Q_DEPTH = 0;
  let INF_AMB = false;   // 不定詞の並列で、過去形と同形の原形（read など）も原形として読む""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
