import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# until late at night → 夜遅くまで
rep("""'for half an hour': '30分間', """,
    """'for half an hour': '30分間', 'until late at night': '夜遅くまで', 'till late at night': '夜遅くまで', 'until late': '遅くまで', 'until midnight': '真夜中まで', """)

# This is too much → これは多すぎる（be + too much）
rep("""    // She is in her thirties / He is in his early twenties → 30代だ・20代前半だ""",
    """    // This is too much / That's too much → これは多すぎる・それはやりすぎだ（be + too much で節が終わる）
    if (vg.lemma === 'be' && !vg.passive && seq(i, ['too', 'much']) && (i + 2 >= lim || T[i + 2].k === 'p' || (T[i + 2].k === 'w' && (PREP[T[i + 2].w] || /^(?:for|now|today)$/.test(T[i + 2].w))))) {
      const eTm = tail(i + 2, lim, st, o, vg);
      if (eTm === lim) return fin(P(sj && /^(?:this|that|it)$/.test(sj.pron || '') ? 'やりすぎだ' : '多すぎる', sj && /^(?:this|that|it)$/.test(sj.pron || '') ? 'da' : 'i'), eTm, 'SVC');
    }
    // She is in her thirties / He is in his early twenties → 30代だ・20代前半だ""")

rep("""    ja = ja.replace(/^(春|夏|秋|冬)に、/, '$1には、');""",
    """    ja = ja.replace(/^(春|夏|秋|冬)に、/, '$1には、');
    ja = ja.replace(/(?:私たちは|私たちには)?([^、。]*?)長い列を持って(いた|いる)/, (m0, a0, b0) => a0 + '長い行列ができて' + b0).replace(/^それぞれの授業は(?=[^、。]*?(?:準備|作|決め|練習|発表|参加|出し))/, 'それぞれのクラスは');   // we had a long line all day → 一日中長い行列ができていた / Each class prepares … → それぞれのクラスは""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
