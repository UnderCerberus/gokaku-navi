import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# last season / this season / next season → 昨シーズン・今シーズン・来シーズン（時の句。最後の季節を にしない）
rep("""'this semester': '今学期', 'last semester': '前学期', 'next semester': '来学期',""",
    """'this semester': '今学期', 'last semester': '前学期', 'next semester': '来学期', 'last season': '昨シーズン', 'this season': '今シーズン', 'next season': '来シーズン',""")

# students … performed better than those who did not → より良い成績を収めた / The band performed … → 演奏した（目的語のない perform は「行う」ではない）
rep("""    if (vg.lemma === 'show' && vg.passive && /^見せる$/.test(p.plain())) p = P('示す', 'v5');""",
    """    if (vg.lemma === 'show' && vg.passive && /^見せる$/.test(p.plain())) p = P('示す', 'v5');
    if (vg.lemma === 'perform' && !vg.passive && /^行う$/.test(p.plain()) && !o.hasObj) {
      const miPf = st.manner.findIndex((x) => /^(?:[^、]*より)?(?:もっと|より|ずっと|とても)?(?:上手に|貧しく|下手に|ひどく|悪く|うまく)$/.test(x));
      if (miPf >= 0) {
        const mxPf = /^([^、]*より)?((?:もっと|より|ずっと|とても)?)(上手に|貧しく|下手に|ひどく|悪く|うまく)$/.exec(st.manner[miPf]);
        st.manner.splice(miPf, 1);
        const badPf = /^(?:貧しく|下手に|ひどく|悪く)$/.test(mxPf[3]);
        p = P((mxPf[1] ? mxPf[1] : (mxPf[2] && mxPf[2] !== 'とても') || T.some((x) => isW(x, 'better') || isW(x, 'worse')) ? 'より' : '') + (badPf ? '悪い' : '良い') + '成績を収める', 'v1');
      }
      else if (sj && /(?:^| )(?:band|bands|orchestra|orchestras|musician|musicians|pianist|pianists|singer|singers|choir|choirs)$/.test(sj.head || '')) p = P('演奏する', 'suru');
    }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
