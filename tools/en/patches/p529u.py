import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# It was the courage to share who I am with people … → それは…人々と共有する勇気だった（the + 勇気・能力・機会 + to do は名詞句の補語。前の文を受ける It。共有することは勇気だった にしない）
rep("""      if (isW(T[n3.end], 'to') && n3.end + 1 < b) {
        const inf2 = vpNonfin(n3.end + 1, b, 'base', {});
        if (inf2 && inf2.end === b) {
          name('it-to');""",
    """      if (isW(T[n3.end], 'to') && n3.end + 1 < b && isW(T[j], 'the') && /^(?:courage|confidence|ability|chance|opportunity|freedom|right|power|strength|will|desire|determination|patience|motivation|energy)$/.test(n3.head || '')) {
        const mCg = mark();
        const nCg = np(j, b, {});
        if (nCg && nCg.end === b) { name('inf-adj'); return mkClause({ ja: 'それ', pron: 'it' }, done(vg, P(nCg.ja + 'だ', 'da'), st, b, 'SVC', o, [], { noStative: true }), ''); }
        fail(mCg);
      }
      if (isW(T[n3.end], 'to') && n3.end + 1 < b) {
        const inf2 = vpNonfin(n3.end + 1, b, 'base', {});
        if (inf2 && inf2.end === b) {
          name('it-to');""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
