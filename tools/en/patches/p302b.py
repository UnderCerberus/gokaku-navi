import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

WHEN_RE = "/^(?:know|wonder|ask|tell|understand|remember|recall|decide|explain|see|show|forget|guess|say|check|find|realize|realise|notice|predict|determine|discover|confirm|learn|teach|care|mind|doubt|matter|depend|choose|clarify|verify|report|record|announce)$/"

rep("""      if (/^(?:when|where|if|how|why)$/.test(T[j].w) && pv.k === 'w' && vc(pv, ['base', '3sg', 'past', 'pp', 'ing']) && WHV[vc(pv, ['base', '3sg', 'past', 'pp', 'ing']).lemma]) continue;""",
    """      if (/^(?:when|where|if|how|why)$/.test(T[j].w) && pv.k === 'w' && vc(pv, ['base', '3sg', 'past', 'pp', 'ing']) && WHV[vc(pv, ['base', '3sg', 'past', 'pp', 'ing']).lemma] && !(T[j].w === 'when' && !""" + WHEN_RE + """.test(vc(pv, ['base', '3sg', 'past', 'pp', 'ing']).lemma))) continue;""")
rep("""      if (/^(?:when|where|if|how|why|whether)$/.test(T[j].w) && pv.k === 'w' && (ADV[pv.w] || (/ly$/.test(pv.w) && advC(pv))) && j - 2 >= a && T[j - 2].k === 'w' && vc(T[j - 2], ['base', '3sg', 'past', 'pp', 'ing']) && WHV[vc(T[j - 2], ['base', '3sg', 'past', 'pp', 'ing']).lemma]) continue;""",
    """      if (/^(?:when|where|if|how|why|whether)$/.test(T[j].w) && pv.k === 'w' && (ADV[pv.w] || (/ly$/.test(pv.w) && advC(pv))) && j - 2 >= a && T[j - 2].k === 'w' && vc(T[j - 2], ['base', '3sg', 'past', 'pp', 'ing']) && WHV[vc(T[j - 2], ['base', '3sg', 'past', 'pp', 'ing']).lemma] && !(T[j].w === 'when' && !""" + WHEN_RE + """.test(vc(T[j - 2], ['base', '3sg', 'past', 'pp', 'ing']).lemma))) continue;""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
