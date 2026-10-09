import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# his eyesight has become poor → 視力が悪くなった（主語の名詞で形容詞の訳を選ぶ。表 ADJN を述語にも使う。い形容詞の訳だけ）
rep("""    'leading|cause causes|主な',""",
    """    'leading|cause causes|主な',
    'poor|eyesight health memory hearing vision quality performance condition conditions sight result results grade grades harvest harvests diet sleep|悪い',""")
rep("""  const ADJN = COLL([""",
    """  const adjBySubj = (lemma, sj) => { if (!ADJN[lemma] || !sj) return null; const h = (plainSubj(sj) || {}).head || sj.head || ''; const y = ADJN[lemma].find((z) => z.re.test(h)); return y && /い$/.test(y.ja) ? y.ja : null; };   // His eyesight is poor → 悪い
  const ADJN = COLL([""")
rep("""        const f = (ap.lemma === 'hot' || ap.lemma === 'cold') && o.subj && !weatherSubj(o.subj) ?""",
    """        const adjS = adjBySubj(ap.lemma, o.subj);
        const f = adjS ? en.jp.adj(adjS) : (ap.lemma === 'hot' || ap.lemma === 'cold') && o.subj && !weatherSubj(o.subj) ?""")
rep("""        const f = en.jp.adj(anim && a.lemma === 'young'""",
    """        const adjS2 = adjBySubj(a.lemma, sj);
        const f = adjS2 ? en.jp.adj(adjS2) : en.jp.adj(anim && a.lemma === 'young'""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
