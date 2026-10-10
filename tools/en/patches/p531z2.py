import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# does far more than translate words → 語を翻訳するよりはるかに多くのことをする（far + more than + 動詞の原形は目的語の名詞句）
rep("""!(/^(?:far|much|many)$/.test(t.w) && isW(T[j0 + 1], 'more') && T[j0 + 2] && T[j0 + 2].k === 'w' && !!nounC(T[j0 + 2]) && !PREP[T[j0 + 2].w] && vg.lemma !== 'spend') &&""",
    """!(/^(?:far|much|many)$/.test(t.w) && isW(T[j0 + 1], 'more') && T[j0 + 2] && T[j0 + 2].k === 'w' && !!nounC(T[j0 + 2]) && !PREP[T[j0 + 2].w] && vg.lemma !== 'spend') && !(/^(?:far|much)$/.test(t.w) && vg.lemma === 'do' && isW(T[j0 + 1], 'more') && isW(T[j0 + 2], 'than') && T[j0 + 3] && T[j0 + 3].k === 'w' && !!vc(T[j0 + 3], ['base'])) &&""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
