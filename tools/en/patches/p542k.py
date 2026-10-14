import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Others are planting trees … and creating green roofs covered with grass → 木を植えていて、草で覆われた緑化屋根を作っている
# （左が be + -ing の文で and のあとが -ing なら、右を動名詞が主語の文として読まない。右にも進行形を及ぼす）
rep("""        let right = (thenPred && left.subj && T[rs].k === 'w' && !!vc(T[rs], ['3sg', 'past', 'base']) && !(PRON[T[rs].w] && PRON[T[rs].w].sub) && DET[T[rs].w] === undefined) || modalStart ? null : sen""",
    """        const ingAfterProg = /^(?:and|or|but)$/.test(w) && !!left.subj && T[rs] && T[rs].k === 'w' && !!vc(T[rs], ['ing']) && !BE[T[rs].w] && T.slice(a, je).some((x, q) => x.k === 'w' && /^(?:is|are|was|were|am)$/.test(x.w) && T[a + q + 1] && T[a + q + 1].k === 'w' && !!vc(T[a + q + 1], ['ing']));
        let right = (thenPred && left.subj && T[rs].k === 'w' && !!vc(T[rs], ['3sg', 'past', 'base']) && !(PRON[T[rs].w] && PRON[T[rs].w].sub) && DET[T[rs].w] === undefined) || modalStart || ingAfterProg ? null : sen""")

# creating green roofs / create a garden → 作る（屋根・庭・公園・地図・リストなど形のある物の create は「作る」。「創造する」にしない）
rep("""      else if (L === 'create' && !vg.passive && /(?:^| )(?:problem|problems|job|jobs|""",
    """      else if (L === 'create' && /(?:^| )(?:roof|roofs|garden|gardens|park|parks|space|spaces|area|areas|map|maps|list|lists|poster|posters|website|websites|video|videos|dictionary|dictionaries|database|databases|app|apps|menu|menus|path|paths|road|roads|pond|ponds|forest|forests|wall|walls|building|buildings|room|rooms|card|cards|book|books|website|page|pages|account|accounts|playlist|schedule|plan|plans|program|programs|game|games|tool|tools|product|products|design|designs|model|models|garden)$/.test(oh)) sense = { particle: 'を', core: '作る', tr: true };
      else if (L === 'create' && !vg.passive && /(?:^| )(?:problem|problems|job|jobs|""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
