import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# I don't read as many books as I used to → 以前ほど多くの本を読まない（as many / much + 名詞 + as + 時の省略節）
rep("""          const elA = thanEllipsis(inner.end + 1, lim);
""", """          const elA = thanEllipsis(inner.end + 1, lim);
          if (elA && /^(?:以前|今まで|いつも)$/.test(elA) && !mu) { const ngA = T.slice(0, i).some((x) => x.k === 'w' && /^(?:not|never|don't|doesn't|didn't|can't|cannot|won't)$/.test(x.w)) || T.slice(0, i).some((x) => x.k === 'w' && /n't$/.test(x.w)); return { ja: elA + (ngA ? 'ほど' : 'と同じくらい') + (isW(T[k0 + 1], 'many') ? '多くの' : 'たくさんの') + inner.ja, end: lim, head: inner.head, an: inner.an, pl: inner.pl }; }   // as many books as I used to → 以前ほど多くの本
""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
