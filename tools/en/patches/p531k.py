import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# healthier and more pleasant places to live → より健康で、より楽しい場所（形容詞 and more + 形容詞 + 名詞の並列）
rep("""      if (!more && md.te && nx && isW(nx, 'and') && md.end + 2 < lim && (adjC(T[md.end + 1]) || (T[md.end + 1].k === 'w' && !!vc(T[md.end + 1], ['ing'])""",
    """      if (!more && md.te && nx && isW(nx, 'and') && md.end + 3 < lim && /^(?:more|most)$/.test(T[md.end + 1].w || '') && !!adjC(T[md.end + 2]) && !cand(T[md.end + 2], '名', ['base', 'pl']) && T[md.end + 3].k === 'w' && !!nounC(T[md.end + 3]) && !PREP[T[md.end + 3].w]) {
        pre += md.te; j = md.end + 1; nmod++;
        continue;
      }
      if (!more && md.te && nx && isW(nx, 'and') && md.end + 2 < lim && (adjC(T[md.end + 1]) || (T[md.end + 1].k === 'w' && !!vc(T[md.end + 1], ['ing'])""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
