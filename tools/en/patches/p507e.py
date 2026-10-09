import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# The study suggests that even a short walk after meals can help …（suggest / show / find + that 節の中の after・when も that 節の中で読む）
rep("""      if (T.slice(a, j).some((x, q) => isW(x, 'that') && a + q > a && T[a + q - 1].k === 'w' && !!vc(T[a + q - 1], ['base', '3sg', 'past']) && (SAYV[vc(T[a + q - 1], ['base', '3sg', 'past']).lemma] || THINKV[vc(T[a + q - 1], ['base', '3sg', 'past']).lemma]))) continue;""",
    """      if (T.slice(a, j).some((x, q) => isW(x, 'that') && a + q > a && T[a + q - 1].k === 'w' && !!vc(T[a + q - 1], ['base', '3sg', 'past']) && (SAYV[vc(T[a + q - 1], ['base', '3sg', 'past']).lemma] || THINKV[vc(T[a + q - 1], ['base', '3sg', 'past']).lemma] || (KNOWV[vc(T[a + q - 1], ['base', '3sg', 'past']).lemma] && /^(?:after|before|until|since|when|while|if)$/.test(T[j].w))))) continue;""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
