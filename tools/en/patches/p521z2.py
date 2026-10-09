import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Half of them use smartphones → 彼らの半分 / Without them, many fruits … → 彼ら（後ろの物の複数名詞を先行詞にするのは、動詞の目的語の them とコンマの後ろの主節の名詞だけ）
rep("""      if (!prevPl) for (let x = i + 1; x < Math.min(T.length, i + 10); x++) {
        const t = T[x];
        if (t.k !== 'w' || PRON[t.w]) continue;""",
    """      if (!prevPl && i > 0 && T[i - 1].k === 'w' && !PREP[T[i - 1].w]) for (let x = i + 1; x < Math.min(T.length, i + 10); x++) {
        const t = T[x];
        if (t.k !== 'w' || PRON[t.w] || !T.slice(i + 1, x).some((y) => isP(y, ','))) continue;""")
# I regret the mistakes I made → 私は犯した間違いを（1 人称は従来どおり省く。自分が は 3 人称だけ）
rep("""    const PJS = subj && subj.pron ? ({ i: '私', we: '私たち', he: '彼', she: '彼女', they: '彼ら' })[subj.pron] : null;""",
    """    const PJS = subj && subj.pron ? ({ he: '彼', she: '彼女', they: '彼ら' })[subj.pron] : null;""")
# have adapted to it over the centuries → 何世紀にもわたってそれに適応した（代名詞 it に前置詞句をかけない）
rep("""      if (node.pron && /^(?:i|you|he|she|we|they|me|him|her|us|them)$/.test(node.pron) && t.k === 'w' && PREP[t.w] && t.w !== 'of') break;""",
    """      if (node.pron && /^(?:i|you|he|she|we|they|me|him|her|us|them|it)$/.test(node.pron) && t.k === 'w' && PREP[t.w] && t.w !== 'of') break;""")
# Peel the potatoes and cut them in half → 半分に切る（時間・費用などの量なら 半分にする）
rep("""        const jaL = it.ja.replace(/A(?:を|に|が|と|の)?/, (m0) => (aL.ja ? aL.ja + m0.slice(1) : ''));""",
    """        const jaL0 = it.it && it.it.phrase === 'cut A in half' && !/(?:^| )(?:time|times|cost|costs|price|prices|number|numbers|amount|amounts|risk|risks|rate|rates|emission|emissions|waste|budget|budgets|spending|population|size|distance|consumption|use|production|fee|fees|bill|bills|tax|taxes|salary|salaries|wage|wages|deficit|debt|staff|workforce|output|demand|traffic|energy|sales|profit|profits|loss|losses|crime|deaths|poverty|unemployment)$/.test(aL.head || '') ? 'Aを半分に切る' : it.ja;
        const jaL = jaL0.replace(/A(?:を|に|が|と|の)?/, (m0) => (aL.ja ? aL.ja + m0.slice(1) : ''));""")
# The New Year holidays → 正月休み / New Year's Eve → 大みそか（辞書の new year = 新年 のあとも同じ置換を効かせる）
rep(""".replace(/新しい年のEve/g, '大みそか')""", """.replace(/(?:新しい年|新年)のEve/g, '大みそか')""")
rep(""".replace(/新しい年の休日/g, '正月休み')""", """.replace(/(?:新しい年|新年)の休日/g, '正月休み')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
