import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""  const LEAD2 = dic({ """, """  const LEAD2 = dic({ 'in my view': '私の考えでは', 'on the one hand': '一方では', 'to put it another way': '言い換えると', 'to put it simply': '簡単に言えば', """)

rep("""'wet paint': 'ペンキ塗りたて', """,
    """'wet paint': 'ペンキ塗りたて', 'you have a point there': '一理ありますね', 'let me put it another way': '言い方を変えてみましょう', 'let me put it this way': 'こう言えばいいでしょうか', 'i am not sure about that': 'それについてはよく分からない', 'there are pros and cons': '長所と短所がある', 'there are both pros and cons': '長所も短所もある', 'i have mixed feelings about it': 'それについては複雑な気持ちだ', 'i have mixed feelings': '複雑な気持ちだ', 'i see your point': '言いたいことは分かります', 'i see what you mean': '言いたいことは分かります', """)

# I'm against the idea → 私はその考えに反対だ / I'm for the plan → 私は計画に賛成だ
rep("""    // The website is down right now → ウェブサイトは今ダウンしている""",
    """    // I'm against the idea → その考えに反対だ / I'm for the plan → 計画に賛成だ
    if (vg.lemma === 'be' && !vg.passive && T[i] && /^(?:against|for)$/.test(T[i].w || '') && i + 1 < lim && sj && (anim || /^(?:i|we|you|they|he|she)$/.test(sj.pron || '')) && (T[i].w === 'against' || T[i + 1].k === 'w' && /^(?:the|this|that|it|your|his|her|their|our)$/.test(T[i + 1].w))) {
      const mAg = mark();
      const nAg = np(i + 1, lim, {});
      if (nAg && nAg.end === lim && !nAg.an && (T[i].w === 'against' || /(?:^| )(?:plan|plans|idea|ideas|proposal|proposals|change|changes|law|laws|rule|rules|policy|policies|project|it|this|that|suggestion|opinion)$/.test(nAg.head || nAg.pron || ''))) {
        name('svc');
        return fin(P(T[i].w === 'against' ? '反対だ' : '賛成だ', 'da'), lim, 'SVC', [nAg.ja + 'に']);
      }
      fail(mAg);
    }
    // The website is down right now → ウェブサイトは今ダウンしている""")

rep("""    ja = ja.replace(/誰か([^、。]{1,16}?)人を持って(いる|いた)/, '$1人が$2')""",
    """    ja = ja.replace(/^私は言いたいことは分かるが、(?:私は)?同意しない/, '言いたいことは分かるが、賛成できない').replace(/^私は言いたいことは分かる/, '言いたいことは分かる').replace(/^私が意味するのは/, '私が言いたいのは').replace(/より多くの時間を必要とする/g, 'もっと時間が必要だ');   // I see your point, but I don't agree / What I mean is that we need more time
    ja = ja.replace(/誰か([^、。]{1,16}?)人を持って(いる|いた)/, '$1人が$2')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
