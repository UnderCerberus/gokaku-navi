import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# hear of ~ → hear about ~（〜について聞く）
rep(""".replace(/\\bU\\.S\\.(?:A\\.)?/g, 'USA')""",
    """.replace(/\\bU\\.S\\.(?:A\\.)?/g, 'USA').replace(/\\b([Hh]ear|[Hh]ears|[Hh]eard|[Hh]earing) of\\b/g, '$1 about')""")

rep("""    if (!tr && !objs.length && vg.imp && L === 'cover'""",
    """    if (!objs.length && L === 'hear' && !vg.passive && T.slice(vg.idx + 1, lim).some((x) => isW(x, 'about'))) sense = { particle: '', core: '聞く', tr: false };   // Have you ever heard of the Tokyo Skytree? → 東京スカイツリーについて聞いたことがありますか
    if (!tr && !objs.length && vg.imp && L === 'cover'""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
