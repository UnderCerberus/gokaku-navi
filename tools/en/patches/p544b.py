import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# my parents were too busy to go → 忙しすぎて行けなかった（too … to go の go に主語の穴を補語として入れない。「忙しすぎてなれなかった」にしない）
rep("""        if (isW(T[ft.end], 'to') && ft.end + 1 < lim) {
          const inf = vpNonfin(ft.end + 1, lim, 'base', { subj: ft.np || sj, gap: { type: 'np', rel: true, used: false } });""",
    """        if (isW(T[ft.end], 'to') && ft.end + 1 < lim) {
          let inf = vpNonfin(ft.end + 1, lim, 'base', { subj: ft.np || sj, gap: { type: 'np', rel: true, used: false } });
          if (inf && inf.vg && /^(?:go|come|get|turn|grow)$/.test(inf.vg.lemma) && /なる$/.test(inf.pred.plain())) { const inf0 = vpNonfin(ft.end + 1, lim, 'base', { subj: ft.np || sj }); if (inf0) inf = inf0; }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
