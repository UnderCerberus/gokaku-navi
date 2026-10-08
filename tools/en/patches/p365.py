import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""'wet paint': 'ペンキ塗りたて', """,
    """'wet paint': 'ペンキ塗りたて', 'thank you so much': '本当にありがとう', 'thanks so much': '本当にありがとう', 'thank you so much for everything': 'いろいろと本当にありがとう', """)

rep("""      else if (L === 'skip' && /(?:^| )(?:breakfast|lunch|dinner|meal|meals|supper)$/.test(oh)) sense = { particle: 'を', core: '抜く', tr: true };""",
    """      else if (L === 'skip' && /(?:^| )(?:breakfast|lunch|dinner|meal|meals|supper)$/.test(oh)) sense = { particle: 'を', core: '抜く', tr: true };
      else if (L === 'keep' && /(?:^| )(?:dinner|lunch|breakfast|food|cake|seat|seats|some|piece|slice|place)$/.test(oh) && T.slice(objs[0].end, lim).some((x) => isW(x, 'for'))) sense = { particle: 'を', core: '取っておく', tr: true };   // keep dinner for you → 夕食を取っておく""")

rep("""    ja = ja.replace(/中国の万里の長城/g, '万里の長城');""",
    """    ja = ja.replace(/中国の万里の長城/g, '万里の長城');
    ja = ja.replace(/(今夜|今日|今晩|帰りが)?遅れるつもりだ(?=。|$)/, (m0, a0) => (a0 ? a0 + 'は' : '') + '遅くなる').replace(/([0-9０-９]+時(?:半)?)までに家にいるつもりだ(?=。|$)/, '$1までには帰る').replace(/に1がある(?=。|$)/, 'に1つある').replace(/放課後に([^、。]{0,20}?)滞在し/, '放課後に$1残ら').replace(/残らなければならない/, '残らなければならない');   // I'm going to be late tonight → 今夜は遅くなる / I'll be home by eight → 8時までには帰る / there's one → 1つある""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
