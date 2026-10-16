import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# wrote down every step on a piece of paper → 手順をすべて書き留めた / Follow these steps → これらの手順に従いなさい
# （書く・説明する・従うなどの目的語の step は「手順」。「すべての一歩」「工程に続く」にしない）
rep("""      else if (L === 'follow' && /^(?:rule|rules|instruction|instructions|advice|law|laws|""",
    """      else if (L === 'follow' && /^(?:step|steps)$/.test(oh)) sense = { particle: 'に', core: '従う', tr: true };
      else if (L === 'follow' && /^(?:rule|rules|instruction|instructions|advice|law|laws|""")
rep("""    if (objs.length === 1 && objs[0].tooMuch && !vg.passive) st.sugiru = true;""",
    """    if (objs.length === 1 && objs[0].tooMuch && !vg.passive) st.sugiru = true;
    if (objs.length && /^(?:step|steps)$/.test(objs[objs.length - 1].head || '') && /^(?:write|explain|follow|list|describe|repeat|complete|check|remember|learn|show|teach|read|memorize|review|outline|forget|understand|copy|note)$/.test(L) && /(?:一歩|工程)$/.test(objs[objs.length - 1].ja || '')) {
      const qSt = objs.length - 1;
      objs[qSt] = Object.assign({}, objs[qSt], { ja: /^すべての(?:一歩|工程)$/.test(objs[qSt].ja) ? '手順をすべて' : objs[qSt].ja.replace(/(?:一歩|工程)$/, '手順') });
      if (/^手順をすべて$/.test(objs[qSt].ja)) objs[qSt].noParticle = true;
    }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
