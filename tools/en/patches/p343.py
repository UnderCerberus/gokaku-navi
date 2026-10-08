import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""    // Hi, Ken. → こんにちは、ケン""",
    """    // I tried to open the window, but I couldn't. → 私は窓を開けようとしたが、開けられなかった（but のあとの助動詞だけの省略は前の動詞を補う）
    {
      const kBt = T.findIndex((x, q) => q > 3 && isW(x, 'but') && isP(T[q - 1], ','));
      if (kBt > 0 && T[kBt + 1] && T[kBt + 1].k === 'w' && PRON[T[kBt + 1].w] && PRON[T[kBt + 1].w].sub && T[kBt + 2] && /^(?:could|can|did|would|will)$/.test(T[kBt + 2].w || '') && isW(T[kBt + 3], 'not') && kBt + 4 === b) {
        const kTo = T.findIndex((x, q) => q < kBt && isW(x, 'to') && q > 0 && /^(?:tried|try|wanted|want|planned|hoped|decided)$/.test(T[q - 1].w || ''));
        const vB = kTo > 0 && T[kTo + 1] ? vc(T[kTo + 1], ['base']) : null;
        if (vB && vB.e) {
          const r1B = translate1(T.slice(0, kBt - 1).map((x, k) => Object.assign({}, x, { i: k })).concat([tokenize('.')[0]].filter(Boolean)));
          reset(tokens);
          const trB = en.jp.senses(vB.e.ja).some((x) => x.tr) && T.slice(kTo + 2, kBt - 1).some((x) => x.k === 'w');
          const t2B = tokenize('I ' + T[kBt + 2].w + ' not ' + T[kTo + 1].w + (trB ? ' it' : '') + '.');
          const r2B = t2B && t2B.length ? translate1(t2B) : null;
          reset(tokens);
          if (r1B && r1B.ok && r2B && r2B.ok) return { ok: true, ja: r1B.ja.replace(/。$/, '') + 'が、' + r2B.ja.replace(/^私は/, '').replace(/^それを/, ''), sp: '', names: ['ellipsis'], sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() };
        }
      }
    }
    // I regret to tell you the news → 残念ながら、あなたにニュースを話さなければならない
    if (seq(0, ['i', 'regret', 'to']) && b > 4 && T[3].k === 'w' && /^(?:tell|inform|say|announce|report)$/.test(T[3].w)) {
      const vRg = vpNonfin(3, b, 'base', {});
      if (vRg && vRg.end === b && verbal(vRg.pred)) return { ok: true, ja: '残念ながら、' + vRg.parts.join('') + vRg.pred.aux('must').plain() + '。', sp: '', names: ['idiom'], sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() };
      reset(tokens);
    }
    // Hi, Ken. → こんにちは、ケン""")

rep("""    ja = ja.replace(/誰か([^、。]{1,16}?)人を持って(いる|いた)/, '$1人が$2')""",
    """    ja = ja.replace(/後に、(彼|彼女|私|私たち|彼ら)はその後/, '後に、$1は続けて');   // After the speech, he went on to answer questions → 続けて質問に答えた
    ja = ja.replace(/誰か([^、。]{1,16}?)人を持って(いる|いた)/, '$1人が$2')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
