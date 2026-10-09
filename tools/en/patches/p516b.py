import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# as often as she used to / than he used to → 以前ほど・以前より（主語 + used to の省略）
# as much as he did（主節が現在で、同じ人の did）→ 以前ほど
rep("""  function thanEllipsis(i, lim, mainSj) {
""", """  function thanEllipsis(i, lim, mainSj) {
    if (i + 3 === lim && T[i].k === 'w' && PRON[T[i].w] && PRON[T[i].w].sub && isW(T[i + 1], 'used') && isW(T[i + 2], 'to')) return '以前';   // as often as she used to → 以前ほど
    if (i + 2 === lim && T[i].k === 'w' && PRON[T[i].w] && PRON[T[i].w].sub && isW(T[i + 1], 'did') && mainSj && mainSj.pron && samePerson(mainSj.pron, T[i].w) && T.slice(0, i).some((x) => x.k === 'w' && /^(?:do|does|don't|doesn't|is|are|am|can)$/.test(x.w))) return '以前';   // He doesn't eat as much as he did → 以前ほど
""")
# as ~ as の副詞の比較で、主節の主語を渡す
rep("""        const el0 = thanEllipsis(ja0 + 3, lim);                                   // as strongly as before / as ever / as usual""",
    """        const el0 = thanEllipsis(ja0 + 3, lim, o && o.subj);                                   // as strongly as before / as ever / as usual""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
