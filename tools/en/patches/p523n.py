import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# It goes without saying that health is more important than money, yet many people forget this
# → 健康がお金より大切なのは言うまでもないが、多くの人はこれを忘れている（, yet / , but の節は that 節の外）
rep("""    if (seq(a, ['it', 'goes', 'without', 'saying', 'that']) && a + 5 < b) {
      const cG = sentence(a + 5, b, { sub: true });""",
    """    if (seq(a, ['it', 'goes', 'without', 'saying', 'that']) && a + 5 < b) {
      for (let x = a + 7; x < b - 2; x++) {
        if (!(isP(T[x], ',') && T[x + 1] && /^(?:yet|but)$/.test(T[x + 1].w || ''))) continue;
        const mGy = mark();
        const cGy = sentence(a + 5, x, { sub: true });
        const rGy = cGy ? sentence(x + 2, b, o) : null;
        if (cGy && rGy) { name('that-clause'); name('idiom'); return wrap({ out: (y) => cGy.out({ part: 'が', form: 'attr' }) + 'のは言うまでもないが、' + rGy.out(y), sp: 'SV' }); }   // …, yet many people forget this
        fail(mGy);
        break;
      }
      const cG = sentence(a + 5, b, { sub: true });""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
