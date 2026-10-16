import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# it is one of the most effective ways to learn → それは学ぶ最も効果的な方法の1つだ
# （way / method + to do の to 不定詞は名詞を修飾する。it を形式主語にして「学ぶことは最も効果的な道の1つだ」にしない）
rep("""      if (isW(T[n3.end], 'to') && n3.end + 1 < b) {
        const inf2 = vpNonfin(n3.end + 1, b, 'base', {});""",
    """      if (isW(T[n3.end], 'to') && n3.end + 1 < b && T[n3.end - 1].k === 'w' && /^(?:way|ways|method|methods|means)$/.test(T[n3.end - 1].w)) {
        const mWy = mark();
        const nWy = np(j, b, {});
        if (nWy && nWy.end === b) { name('inf-adj'); return mkClause({ ja: 'それ', pron: 'it' }, done(vg, P(nWy.ja + 'だ', 'da'), st, b, 'SVC', o, [], { noStative: true }), ''); }
        fail(mWy);
      }
      if (isW(T[n3.end], 'to') && n3.end + 1 < b) {
        const inf2 = vpNonfin(n3.end + 1, b, 'base', {});""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
