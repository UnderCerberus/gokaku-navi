import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# They have thousands of times more mass than a spark → 火花の何千倍もの質量（比較級の前の thousands of times は倍数。何千回も にしない）
rep("""      if (key && TIMEPH[key] && !pastSpan && !(key === 'as well' && isW(T[j + len], 'as') && j + len + 1 < lim)""",
    """      if (key && TIMEPH[key] && !pastSpan && !(/ of times$/.test(key) && T[j + len] && T[j + len].k === 'w' && (/^(?:more|less|fewer|as)$/.test(T[j + len].w) || (adjC(T[j + len]) && adjC(T[j + len]).form === 'comp') || (advC(T[j + len]) && advC(T[j + len]).comp))) && !(key === 'as well' && isW(T[j + len], 'as') && j + len + 1 < lim)""")
# What matters is not how much you study → どれだけ勉強するか（お金の動詞のときだけ いくら）
rep("""          return { end: i + 2, type: 'np', node: { ja: nx.w === 'many' ? 'いくつ' : (knowMuch ? 'どれほど多くのこと' : 'いくら'), wh: true, bare: !knowMuch } };""",
    """          const moneyMuch = T.slice(i + 2, lim).some((x) => x.k === 'w' && /^(?:earn|earns|earned|cost|costs|pay|pays|paid|spend|spends|spent|charge|charges|charged|sell|sells|sold|buy|buys|bought|owe|owes|owed|worth|price|money|yen|dollars|make|makes|made|raise|raised|donate|donated|save|saved|lend|lent|borrow|borrowed)$/.test(x.w));
          return { end: i + 2, type: 'np', node: { ja: nx.w === 'many' ? 'いくつ' : (knowMuch ? 'どれほど多くのこと' : (moneyMuch ? 'いくら' : 'どれだけ')), wh: true, bare: !knowMuch } };""")
# 内蔵長文の既存の置換（stay → 残る・ones の先行詞のあとも同じ訳にする）
rep(""".replace(/^あなたは滞在して、あなたの友達は来て、それから彼らの両親は来た/, '君が店にいてくれたから、君の友達が来て、それからその親たちも来たんだ')""",
    """.replace(/^あなたは(?:滞在して|残って)、あなたの友達は来て、それから彼らの両親は来た/, '君が店にいてくれたから、君の友達が来て、それからその親たちも来たんだ')""")
rep(""".replace(/^ときどき最も強力な考えは複雑なものではない/, '最も強力な考えが、複雑なものだとは限らない')""",
    """.replace(/^ときどき最も強力な考えは複雑な(?:もの|考え)ではない/, '最も強力な考えが、複雑なものだとは限らない')""")
rep(""".replace(/^別の取り組み方は暗いものより多くの日光を反射する明るい色に屋根と道路を塗ることだ/,""",
    """.replace(/^別の取り組み方は暗い(?:もの|色)より多くの日光を反射する明るい色に屋根と道路を塗ることだ/,""")
# How much is this bag? → いくらですか（be 動詞の how much は値段）
rep("""          const moneyMuch = T.slice(i + 2, lim).some((x) => x.k === 'w' &&""",
    """          const moneyMuch = (T[i + 2] && T[i + 2].k === 'w' && /^(?:is|are|was|were|will|does|did|do)$/.test(T[i + 2].w)) || T.slice(i + 2, lim).some((x) => x.k === 'w' &&""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
