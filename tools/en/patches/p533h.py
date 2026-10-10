import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Studies suggest that birds can sense …, almost as if they had a compass … → 鳥がまるで…かのように…感じ取れることを示唆する（suggest / show + that 節の後ろの as if は that 節の中）
rep("""      // Many students say that they feel nervous when they speak …（言う・思う + that 節の中の when は that 節の中で読む）""",
    """      if (/^(?:as if|as though|almost as if|just as if|almost as though)$/.test(s2.key) && T.slice(a, j).some((x, q) => isW(x, 'that') && q > 0 && T[a + q - 1].k === 'w' && !!vc(T[a + q - 1], ['base', '3sg', 'past']) && !!KNOWV[vc(T[a + q - 1], ['base', '3sg', 'past']).lemma])) continue;
      // Many students say that they feel nervous when they speak …（言う・思う + that 節の中の when は that 節の中で読む）""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
