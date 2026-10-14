import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# I offered to set one aside for her → 彼女のために1つ取っておく（動詞 + 目的語 + aside の熟語も「動詞 + 目的語 + 副詞」の枠で読む）
rep("""verbLike(ja) && /^(?:up|out|off|away|back|down|over|on|in|apart|free|around|round|together)$/.test(low[2])) {""",
    """verbLike(ja) && /^(?:up|out|off|away|back|down|over|on|in|apart|free|around|round|together|aside|behind)$/.test(low[2])) {""")
rep("""      } else if (it.shape === 'obj' && n === 1 && !seq(i, it.lit) && !seq(i, ['not', 'so', 'much']) && /^(?:up|out|off|away|back|down|over|on|in|apart|free|around|round|together)$/.test(it.lit[0])) {""",
    """      } else if (it.shape === 'obj' && n === 1 && !seq(i, it.lit) && !seq(i, ['not', 'so', 'much']) && /^(?:up|out|off|away|back|down|over|on|in|apart|free|around|round|together|aside|behind)$/.test(it.lit[0])) {""")

# set one aside / two loaves instead of one → 1つ（物を数える one は「人」にしない）
rep("""        r = done(vg, P(jaSp2.replace('〜', a.ja)), st, tail(a.end + 1, lim, st, o, vg), 'SVO', o, [], { noStative: true });""",
    """        r = done(vg, P(jaSp2.replace('〜', a.pron === 'one' && a.ja === '人' ? '1つ' : a.ja)), st, tail(a.end + 1, lim, st, o, vg), 'SVO', o, [], { noStative: true });""")
rep("""  function ppJa(key, obj, o) {
""",
    """  function ppJa(key, obj, o) {
    if (obj.pron === 'one' && obj.ja === '人' && /^(?:instead of|than|rather than|like|from|except|besides)$/.test(key)) obj = Object.assign({}, obj, { ja: '1つ' });
""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
