import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# words they are likely to forget → 彼らが忘れそうな語 / mistakes students are likely to make
# （be 熟語の to do（be likely / able / supposed to do）の目的語にも関係詞の空所を入れる）
rep("""        const v = vpNonfin(e0, lim, it.shape === 'do' ? 'base' : 'ing', { subj: sj });
        if (!v) { fail(m1); continue; }""",
    """        const gpDo = o.gap && !o.gap.used && o.gap.type === 'np' && o.gap.rel && it.shape === 'do' ? o.gap : undefined;
        const v = vpNonfin(e0, lim, it.shape === 'do' ? 'base' : 'ing', gpDo ? { subj: sj, gap: gpDo } : { subj: sj });
        if (!v) { fail(m1); continue; }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
