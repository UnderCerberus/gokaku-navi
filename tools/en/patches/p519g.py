import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Young people today use smartphones → 今日の若い人々は（主語の直後の today / nowadays は主語にかける）
rep("""          for (let x = p - 1; x >= s1; x--) {
            if (T[x].w === 'then' && x === p - 1 && !isP(T[x - 1], ',')) { conn = 'それから、' + conn; continue; }   // The bee then carries the pollen → それから""",
    """          for (let x = p - 1; x >= s1; x--) {
            if (x === s1 && /^(?:today|nowadays)$/.test(T[x].w) && sj && !sj.pron && (sj.pl || sj.an || /^(?:people|youth|society|technology)$/.test(sj.head || '')) && !/^(?:今日の|現代の)/.test(sj.ja || '')) { sj = Object.assign({}, sj, { ja: (T[x].w === 'today' ? '今日の' : '最近の') + sj.ja }); continue; }   // young people today → 今日の若い人々
            if (T[x].w === 'then' && x === p - 1 && !isP(T[x - 1], ',')) { conn = 'それから、' + conn; continue; }   // The bee then carries the pollen → それから""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
