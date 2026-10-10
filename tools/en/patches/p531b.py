import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# The residents, in turn, agree to … → 今度は、住民は…（挿入の in turn）
rep("""    'weather permitting': '天気がよければ', 'so to speak': 'いわば'""",
    """    'weather permitting': '天気がよければ', 'so to speak': 'いわば', 'in turn': '今度は'""")

# a stranger had gone out of their way to help me → 見知らぬ人がわざわざ私を助けてくれた（go out of one's way to do）
rep("""    if (vg.lemma === 'turn' && !vg.passive && seq(i, ['out', 'to']) && i + 2 < lim && T[i + 2].k === 'w' && !!vc(T[i + 2], ['base']) && !isW(T[i + 2], 'be')) {""",
    """    if (vg.lemma === 'go' && !vg.passive && seq(i, ['out', 'of']) && T[i + 2] && /^(?:my|your|his|her|our|their|its|one's)$/.test(T[i + 2].w || '') && isW(T[i + 3], 'way') && isW(T[i + 4], 'to') && i + 5 < lim && T[i + 5].k === 'w' && !!vc(T[i + 5], ['base'])) {
      const mGw = mark();
      const iGw = vpNonfin(i + 5, lim, 'base', { subj: o.subj });
      if (iGw && verbal(iGw.pred)) { const rGw = done(vg, P('わざわざ' + vpJoin(iGw, 'dict'), iGw.pred.cls || 'v5'), st, iGw.end, 'SV', o, [], { noStative: true }); if (rGw) { name('idiom'); return rGw; } }
      fail(mGw);
    }
    if (vg.lemma === 'turn' && !vg.passive && seq(i, ['out', 'to']) && i + 2 < lim && T[i + 2].k === 'w' && !!vc(T[i + 2], ['base']) && !isW(T[i + 2], 'be')) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
