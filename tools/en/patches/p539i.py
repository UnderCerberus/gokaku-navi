import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# I have helped many other animals find new homes → 多くの他の動物が新しい家を見つけるのを手伝った（数量の代名詞 many / some … のあとの other・形容詞は名詞句の続き。目的語を many だけで切らない）
rep("""      if (n && n.end === q && q === i + 1 && /^(?:his|its|their|my|your|our)$/.test(T[i].w || '') && T[q].k === 'w' && !!nounC(T[q]) && !PREP[T[q].w]) { fail(m); continue; }""",
    """      if (n && n.end === q && q === i + 1 && /^(?:his|its|their|my|your|our)$/.test(T[i].w || '') && T[q].k === 'w' && !!nounC(T[q]) && !PREP[T[q].w]) { fail(m); continue; }
      if (n && n.end === q && q === i + 1 && /^(?:many|some|most|few|several|all|both|each|much|any)$/.test(T[i].w || '') && T[q].k === 'w' && (/^(?:other|more)$/.test(T[q].w) || (!!adjC(T[q]) && q + 1 < lim && T[q + 1].k === 'w' && !!nounC(T[q + 1]) && !PREP[T[q + 1].w])) && !vc(T[q], ['base'])) { fail(m); continue; }""")

# Each time I feel the same mix of sadness and joy → 同じ悲しみと喜びの入り混じった気持ち（知覚動詞 + the same + 名詞にもなる原形は名詞句）
rep("""      !(CAUS[L][2] === 'perception' && /^(?:this|that|these|those)$/.test(ob.pron || '') && j === i + 1 && !!nounC(tj))) {""",
    """      !(CAUS[L][2] === 'perception' && /^(?:this|that|these|those)$/.test(ob.pron || '') && j === i + 1 && !!nounC(tj)) &&
      !(CAUS[L][2] === 'perception' && seq(i, ['the', 'same']) && j === i + 2 && !!nounC(tj))) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
