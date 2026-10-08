import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""(/^(?:bone|bones|leg|legs|arm|arms|branch|branches|pencil|pencils|finger|fingers|rib|ribs|nose|wrist|ankle|toe|toes)$/.test(nPa) ? '折れた' :""",
    """(/^(?:bone|bones|leg|legs|arm|arms|finger|fingers|rib|ribs|nose|wrist|wrists|ankle|ankles|toe|toes|hip|collarbone)$/.test(nPa) ? '骨折した' : /^(?:branch|branches|pencil|pencils|stick|sticks|tooth|teeth)$/.test(nPa) ? '折れた' :""")

# a sweet liquid called nectar（名詞にもなる語のあとの分詞は後置修飾。called / named などは前置修飾にしない）
rep("""      const ppNext = !!nx && nx.k === 'w' && !!vc(nx, ['pp', 'ing']) && !vc(nx, ['base']) && !nounC(nx) && !adjC(nx) &&""",
    """      const ppNext = !!nx && nx.k === 'w' && !!vc(nx, ['pp', 'ing']) && !vc(nx, ['base']) && !nounC(nx) && !adjC(nx) && !nounC(T[md.end - 1]) && !/^(?:called|named|known|titled|entitled|located|based|made|caused|used|given|written|left|taken|held|found|born|shown|seen|sold|bought|sent|built)$/.test(nx.w) &&""")

# We had no food and no water → 食べ物も水もなかった（no / any は所有）
rep("""      else if (L === 'have' && !vg.passive && !vg.perfect && objs.length === 1 && !objs[0].an && (vg.imp""",
    """      else if (L === 'have' && !vg.passive && !vg.perfect && objs.length === 1 && !objs[0].an && !/^(?:no|any|enough)$/.test(objs[0].det || '') && !T.slice(vg.idx + 1, objs[0].end).some((x) => /^(?:no|any|enough|plenty)$/.test(x.w || '')) && (vg.imp""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
