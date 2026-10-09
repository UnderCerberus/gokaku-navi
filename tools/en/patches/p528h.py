import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# the less I understood it → ますますそれが分からなくなった（後半が過去なら なくなった）
rep("""      const p2 = (mdL ? P(c2.pred.plain().slice(0, -mdL[1].length)) : c2.pred).aux('neg');
      nodeL.out = () => first() + 'ますます' + h2.pre + (c2.parts || []).join('') + p2.plain().replace(/ない$/, 'なくなる') + (mdL ? mdL[1] : '');""",
    """      const p2b = mdL ? P(c2.pred.plain().slice(0, -mdL[1].length)) : c2.pred;
      const p2 = p2b.aux('neg');
      nodeL.out = () => first() + 'ますます' + h2.pre + (c2.parts || []).join('') + p2.plain().replace(/ない$/, c2.past && !mdL ? 'なくなった' : 'なくなる') + (mdL ? mdL[1] : '');""")

# 既存の置換を、目的語 それを・過去の なくなった にも効くように直す（ますますそれが分からなくなった）
rep("    ja = ja.replace(/ますます理解しなくなる(?=。|$)/, (m0) => (tokens.some((x) => /^(?:learned|learnt|understood|knew|read|studied|became|got)$/.test(x.w || '')) ? 'ますます分からなくなった' : 'ますます分からなくなる'));   // The more I learned, the less I understood",
    "    ja = ja.replace(/ますます(それを)?理解しなくな(?:る|った)(?=。|$)/, (m0, o0) => 'ますます' + (o0 ? 'それが' : '') + (tokens.some((x) => /^(?:learned|learnt|understood|knew|read|studied|became|got|thought)$/.test(x.w || '')) ? '分からなくなった' : '分からなくなる'));   // The more I learned, the less I understood / the less I understood it")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
