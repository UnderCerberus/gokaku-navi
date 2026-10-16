import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# I have too much work → 仕事が多すぎる（have too much / many + 名詞は「〜が多すぎる」。「仕事を持っていすぎる」にしない）
rep("""    if (objs.length === 1 && objs[0].tooMuch && !vg.passive) st.sugiru = true;""",
    """    if (objs.length === 1 && objs[0].tooMuch && !vg.passive && L === 'have' && !vg.perfect) { name('too'); return done(vg, P('多すぎる', 'v1'), st, j, 'SVO', o, [objs[0].ja + 'が'], { noStative: true }); }
    if (objs.length === 1 && objs[0].tooMuch && !vg.passive) st.sugiru = true;""")

# which feed most of the world's population → 世界の人口のほとんどを養う（人口・人々・家族を目的語にとる feed は「養う」）
rep("""      else if (L === 'control' && /^(?:temperature|temperatures|light|humidity|heat|speed|volume|flow|pressure|level|levels|amount|brightness)$/.test(oh)) sense = { particle: 'を', core: '調節する', tr: true };""",
    """      else if (L === 'control' && /^(?:temperature|temperatures|light|humidity|heat|speed|volume|flow|pressure|level|levels|amount|brightness)$/.test(oh)) sense = { particle: 'を', core: '調節する', tr: true };
      else if (L === 'feed' && /^(?:population|populations|people|family|families|world|city|cities|country|countries|nation|nations|millions|billions|humanity|mankind)$/.test(oh)) sense = { particle: 'を', core: '養う', tr: true };""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
