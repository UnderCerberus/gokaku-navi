import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# the place he is likely to go → 彼が行きそうな場所（p544l の空所を go / come の補語にして「なりそうな」にしない。空所は写しで試してから戻す）
rep("""        const gpDo = o.gap && !o.gap.used && o.gap.type === 'np' && o.gap.rel && it.shape === 'do' ? o.gap : undefined;
        const v = vpNonfin(e0, lim, it.shape === 'do' ? 'base' : 'ing', gpDo ? { subj: sj, gap: gpDo } : { subj: sj });
        if (!v) { fail(m1); continue; }""",
    """        const gpDo = o.gap && !o.gap.used && o.gap.type === 'np' && o.gap.rel && it.shape === 'do' ? Object.assign({}, o.gap, { used: false }) : undefined;
        let v = vpNonfin(e0, lim, it.shape === 'do' ? 'base' : 'ing', gpDo ? { subj: sj, gap: gpDo } : { subj: sj });
        if (v && gpDo && gpDo.used && v.vg && /^(?:go|come|get|turn|grow)$/.test(v.vg.lemma) && /なる$/.test(v.pred.plain())) { v = vpNonfin(e0, lim, 'base', { subj: sj }); gpDo.used = false; }
        if (gpDo && gpDo.used) Object.assign(o.gap, gpDo);
        if (!v) { fail(m1); continue; }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
