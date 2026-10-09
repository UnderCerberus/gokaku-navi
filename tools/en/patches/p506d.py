import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Although …, residents prefer to drive because they feel the roads are not safe enough（3 段目の入れ子でも、思う・言う + 限定詞 / 主格の代名詞なら that のない節を読む）
rep("""      const tc = !fullObj && !percP && ((isW(t, 'that') && i + 1 < lim) || (DEPTH < 3 && !/^(?:hold|maintain|keep)$/.test(L))) ? thatClause(i, lim, vg.past || vg.modal === 'could') : null;""",
    """      const tc = !fullObj && !percP && ((isW(t, 'that') && i + 1 < lim) || (DEPTH < 3 && !/^(?:hold|maintain|keep)$/.test(L)) || (DEPTH < 4 && (THINKV[L] || /^(?:say|said|says|know|realize|hope)$/.test(L)) && t && t.k === 'w' && (DET[t.w] !== undefined || (PRON[t.w] && PRON[t.w].sub)))) ? thatClause(i, lim, vg.past || vg.modal === 'could') : null;""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
