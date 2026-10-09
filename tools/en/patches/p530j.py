import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Students who lived far from school → 学校から遠く離れて住んでいた（live + far / near / close は場所の句がなくても 住む。生きた にしない）
rep("""    else if (vg.lemma === 'live' && /^住(?:む|んでいる)$/.test(p.plain()) && !o.relWhere && !(o.gap && o.gap.type === 'adv') &&""",
    """    else if (vg.lemma === 'live' && /^住(?:む|んでいる)$/.test(p.plain()) && !o.relWhere && !(o.gap && o.gap.type === 'adv') && !(vg.idx >= 0 && T[vg.idx + 1] && /^(?:far|near|close|nearby)$/.test(T[vg.idx + 1].w || '')) &&""")

# review difficult parts as many times as they want → 好きなだけ何度でも復習できる（as many times as は 2 つ目の目的語にしない）
rep("""      if (isW(t, 'the') && T[j0 + 1] && /^(?:night|day|morning|evening|week|month|year|weekend)$/.test(T[j0 + 1].w || '') && T[j0 + 2] && /^(?:before|after)$/.test(T[j0 + 2].w || '')""",
    """      if (seq(j0, ['as', 'many', 'times', 'as'])) { const kAm = modOther(j0, lim, st, o, vg); if (kAm > 0) { j = kAm; continue; } }
      if (isW(t, 'the') && T[j0 + 1] && /^(?:night|day|morning|evening|week|month|year|weekend)$/.test(T[j0 + 1].w || '') && T[j0 + 2] && /^(?:before|after)$/.test(T[j0 + 2].w || '')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
