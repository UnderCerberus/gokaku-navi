import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# many scientists believed that only humans could experience … → 人間だけが…経験できると（that 節の中の「〜だけ」の主語にも が を付ける。「人間だけ複雑な感情を」にしない）
rep("""(sj.bare ? (/だけ$/.test(sj.ja) && !/[0-9０-９]+(?:人|匹|頭|羽|台|冊|つ)だけ$/.test(sj.ja) && !o.part && !cl.neg && !cl.also ? 'が' : '')""",
    """(sj.bare ? (/だけ$/.test(sj.ja) && !/[0-9０-９]+(?:人|匹|頭|羽|台|冊|つ)だけ$/.test(sj.ja) && (!o.part || o.part === 'が') && !cl.neg && !cl.also ? 'が' : '')""")

# according to instinct / according to the rules → 本能に従って・規則に従って（情報源でない according to は「〜に従って」。「本能によれば」にしない）
rep("""    if (key === 'in' && /^過去100年間$/.test(n) && T.some((x, q) => isW(x, 'last') && isW(T[q + 1], 'century'))) return R('前世紀に', 'time', '前世紀の');""",
    """    if (key === 'according to' && obj.head && /^(?:instinct|instincts|rule|rules|plan|plans|law|laws|tradition|traditions|custom|customs|instruction|instructions|recipe|recipes|schedule|schedules|order|orders|principle|principles|guideline|guidelines|wish|wishes|nature|program|programme|pattern|patterns|habit|habits)$/.test(obj.head)) return R(n + 'に従って', 'other', n + 'に従った');
    if (key === 'in' && /^過去100年間$/.test(n) && T.some((x, q) => isW(x, 'last') && isW(T[q + 1], 'century'))) return R('前世紀に', 'time', '前世紀の');""")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
