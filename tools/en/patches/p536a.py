import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# I do not know why / scientists still do not fully understand why → その理由を知らない・理解していない（節の末尾の疑問詞だけの目的語）
rep("""    // He turned 18 last week → 先週18歳になった（turn + 年齢の数）""",
    """    if (WHV[L] && !vg.passive && t && t.k === 'w' && /^(?:why|how|where|when|who|what)$/.test(t.w) && (i + 1 >= lim || T[i + 1].k === 'p')) {
      const WHO = { why: 'その理由を', how: 'その方法を', where: 'それがどこかを', when: 'それがいつかを', who: 'それが誰かを', what: 'それが何かを' };
      if (L === 'wonder') return done(vg, P(({ why: 'なぜだろう', how: 'どうやってだろう', where: 'どこだろう', when: 'いつだろう', who: '誰だろう', what: '何だろう' })[t.w] + 'と思う', 'v5'), st, i + 1, 'SVO', o, [], { noStative: true });
      const svW = verbSense(vg.e, true);
      return done(vg, P(svW.core), st, i + 1, 'SVO', o, [WHO[t.w]], { noStative: true });
    }
    // He turned 18 last week → 先週18歳になった（turn + 年齢の数）""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
