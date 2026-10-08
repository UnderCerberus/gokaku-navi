import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""    ja = ja.replace(/まだ練習されている/g, '今でも行われている')""",
    """    if (tokens.some((x) => /^(?:ceremony|ceremonies|tradition|traditions|custom|customs|festival|festivals|ritual|rituals|art|arts|style)$/.test(x.w || ''))) ja = ja.replace(/練習されている/g, '行われている').replace(/練習されていた/g, '行われていた');   // the style of tea ceremony that is still practiced today → 今でも行われている
    ja = ja.replace(/まだ練習されている/g, '今でも行われている')""")

rep("""      else if (L === 'skip' && /(?:^| )(?:breakfast|lunch|dinner|meal|meals|supper)$/.test(oh)) sense = { particle: 'を', core: '抜く', tr: true };""",
    """      else if (L === 'skip' && /(?:^| )(?:breakfast|lunch|dinner|meal|meals|supper)$/.test(oh)) sense = { particle: 'を', core: '抜く', tr: true };
      else if (L === 'develop' && /(?:^| )(?:style|styles|school|form|forms|theory|theories|method|methods)$/.test(oh) && !vg.passive && /^(?:style|styles|school|form|forms)$/.test(objs[0].head || '')) sense = { particle: 'を', core: '確立する', tr: true };   // developed the style of tea ceremony → 茶道の様式を確立した""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
