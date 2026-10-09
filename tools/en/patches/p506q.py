import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# many young people today see … during their careers → 彼らの（主語の人の名詞と動詞の間に today / now / often などの副詞があっても人を受ける）
rep("""        if (c0 && !PRON[t0.w] && (isPerson(c0) || PERSONS[c0.lemma] || ORG[c0.lemma]) && T[x + 1] && T[x + 1].k === 'w' && (MODAL[T[x + 1].w] || !!vc(T[x + 1], ['base', 'past']) || BE[T[x + 1].w] || HAVE[T[x + 1].w])) return 'an';""",
    """        const x1 = T[x + 1] && T[x + 1].k === 'w' && /^(?:today|now|nowadays|often|also|still|usually|always|generally|sometimes|really|actually|increasingly|typically|currently|recently|all|both|themselves)$/.test(T[x + 1].w) ? x + 2 : x + 1;
        if (c0 && !PRON[t0.w] && (isPerson(c0) || PERSONS[c0.lemma] || ORG[c0.lemma]) && T[x1] && T[x1].k === 'w' && (MODAL[T[x1].w] || !!vc(T[x1], ['base', 'past']) || BE[T[x1].w] || HAVE[T[x1].w])) return 'an';""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
