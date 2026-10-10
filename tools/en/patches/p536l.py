import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# You may have noticed this while reading the last two sentences → 最後の2つの文を読んでいる間に（while / when + -ing は主語のない分詞。節として「reading … が判決を下す」と読まない）
rep("""      if (/^(?:because|why|how)$/.test(T[j].w) && T[j - 1].k === 'w' && BE[T[j - 1].w]) continue;      // This may be because … は be の補語（parseBe で読む）""",
    """      if (/^(?:because|why|how)$/.test(T[j].w) && T[j - 1].k === 'w' && BE[T[j - 1].w]) continue;      // This may be because … は be の補語（parseBe で読む）
      if (/^(?:while|when)$/.test(s2.key) && T[j + 1] && T[j + 1].k === 'w' && !!vc(T[j + 1], ['ing']) && (!nounC(T[j + 1]) || ingVerb(j + 1, b)) && !isP(T[j - 1], ',')) continue;   // while reading the last two sentences""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
