import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# … need around eight to ten hours a night, which is more than many of them actually get → …必要として、そのことが…量より多い
# （a night / a day などの割合の句のあとの , which は前の内容全体を受ける。夜を修飾しない）
rep("""        const evalW = T[x + 2].k === 'w' && BE[T[x + 2].w]""",
    """        const rateAnte = x > 1 && isW(T[x - 2], 'a') && /^(?:night|day|week|month|year|time)$/.test(T[x - 1].w || '') && T[x + 2] && T[x + 2].k === 'w' && !!BE[T[x + 2].w];
        const evalW = T[x + 2].k === 'w' && BE[T[x + 2].w]""")
rep("""        if (first && !evalW && !(T[xv].k === 'w' && /^(?:make|mean|cause|lead|help|allow|result|explain|show|suggest|save|reduce|increase|raise|keep|give|bring|force|enable|prevent|encourage|require|create|add|turn|put|surprise|shock|please|disappoint|upset|an""",
    """        if (first && !evalW && !rateAnte && !(T[xv].k === 'w' && /^(?:make|mean|cause|lead|help|allow|result|explain|show|suggest|save|reduce|increase|raise|keep|give|bring|force|enable|prevent|encourage|require|create|add|turn|put|surprise|shock|please|disappoint|upset|an""")

# offering recorded lessons → 録画された授業（記録された + 授業・講義・番組 → 録画された。教訓 にしない）
rep("""    if (node && !node.pron && node.end >= 1 && isW(T[node.end - 1], 'strengths') && /力$/.test(node.ja || '')) node = Object.assign({}, node, { ja: node.ja.replace(/力$/, '長所') });""",
    """    if (node && !node.pron && node.end >= 1 && isW(T[node.end - 1], 'strengths') && /力$/.test(node.ja || '')) node = Object.assign({}, node, { ja: node.ja.replace(/力$/, '長所') });
    if (node && !node.pron && node.end >= 2 && isW(T[node.end - 2], 'recorded') && /^(?:lesson|lessons|class|classes|lecture|lectures|program|programs|programme|programmes|show|shows)$/.test(T[node.end - 1].w || '') && /記録された/.test(node.ja || '')) node = Object.assign({}, node, { ja: node.ja.replace('記録された', '録画された') });""")
rep("""&& !/(?:録画された|オンラインの|個人の|無料の|特別な)授業$/.test(objs[0].ja) &&""",
    """&& !/(?:録画された|記録された|オンラインの|個人の|無料の|特別な)授業$/.test(objs[0].ja) &&""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
