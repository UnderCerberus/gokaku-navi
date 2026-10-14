import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# use the English I had been studying for years → 何年も勉強していた英語 / The English I learned at school → 学校で学んだ英語
# （the + 国語名 + 関係詞節（study / learn / speak / use …）は言語。「イギリス人」にしない）
rep("""    if (detW === 'the' && !num && nom.c && NATION[nom.c.lemma] && nom.c.form !== 'pl' && !nom.pl && (nom.n === 1 || /^(?:古代の|現代の|初期の|若い|年老いた)$/.test(nom.preJa))) {""",
    """    const langRel = LANG_JA[(nom.c || {}).lemma] && T[nom.end] && T[nom.end].k === 'w' && (/^(?:that|which)$/.test(T[nom.end].w) || (PRON[T[nom.end].w] && PRON[T[nom.end].w].sub)) && T.slice(nom.end + 1, Math.min(lim, nom.end + 6)).some((x) => x.k === 'w' && /^(?:study|studies|studied|studying|learn|learns|learned|learnt|learning|speak|speaks|spoke|spoken|speaking|use|uses|used|using|teach|teaches|taught|know|knows|knew|write|writes|wrote|written|read|hear|hears|heard|practice|practiced|practise|practised)$/.test(x.w));
    if (detW === 'the' && !num && !langRel && nom.c && NATION[nom.c.lemma] && nom.c.form !== 'pl' && !nom.pl && (nom.n === 1 || /^(?:古代の|現代の|初期の|若い|年老いた)$/.test(nom.preJa))) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
