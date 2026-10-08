import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# What do you think will happen? → 何が起こると思いますか / Where do you think he went? → 彼はどこに行ったと思いますか
rep("""    // How far is it from here to the airport? → ここから空港までどのくらいの距離ですか""",
    """    if (T[a] && T[a].k === 'w' && /^(?:what|who|whom|which|where|when|why|how)$/.test(T[a].w)) {
      let kTh = -1;
      for (let x = a + 1; x + 2 < b && x <= a + 4; x++) if (T[x].k === 'w' && DO[T[x].w] && isW(T[x + 1], 'you') && T[x + 2] && /^(?:think|suppose|believe|guess|imagine|expect)$/.test(T[x + 2].w || '')) { kTh = x; break; }
      if (kTh > a && kTh + 3 < b) {
        const mTh = mark();
        const newTh = T.slice(0, kTh).concat(T.slice(kTh + 3));
        const limTh = b - 3;
        const rTh = withTokens(newTh, () => whClause(a, limTh));
        if (rTh && rTh.end === limTh) {
          let bodyTh = rTh.str.replace(/か$/, '');
          if (/(?:どこ|いつ|なぜ|どう|何歳|何を|何と|どれくらい|どのくらい)/.test(bodyTh)) bodyTh = bodyTh.replace(/^(彼|彼女|あなた|私|それ|彼ら|私たち|あなたたち)が/, '$1は');
          const vTh = ({ think: '思い', suppose: '思い', believe: '思い', guess: '思い', imagine: '思い', expect: '思い' })[T[kTh + 2].w];
          return Fx(bodyTh + (/(?:る|う|く|ぐ|す|つ|ぬ|ぶ|む|い|た|だ)$/.test(bodyTh) ? '' : 'だ') + 'と' + vTh + (T[kTh].w === 'did' ? 'ましたか' : 'ますか'), 'SV');
        }
        fail(mTh);
      }
    }
    // How far is it from here to the airport? → ここから空港までどのくらいの距離ですか""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
