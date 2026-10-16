import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# words they are likely to forget → 彼らが忘れそうな語 / mistakes students are likely to make（関係詞の空所を be likely / able to do の目的語に入れる）
rep("""        if (isW(T[e], 'to') && e + 1 < lim && (vc(T[e + 1], ['base']) || isW(T[e + 1], 'be'))) {
          const gap = { type: 'np', rel: true, used: false };
          const inf3 = vpNonfin(e + 1, lim, 'base', { subj: sj, gap: gap });""",
    """        if (isW(T[e], 'to') && e + 1 < lim && (vc(T[e + 1], ['base']) || isW(T[e + 1], 'be'))) {
          const gap = o.gap && !o.gap.used && o.gap.type === 'np' && o.gap.rel && !TOUGH[a.lemma] && /^(?:likely|unlikely|able|unable|willing|ready|eager|sure|certain|free)$/.test(a.lemma) ? o.gap : { type: 'np', rel: true, used: false };
          const inf3 = vpNonfin(e + 1, lim, 'base', { subj: sj, gap: gap });""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
