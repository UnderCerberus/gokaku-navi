import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""|number|level|levels|rate|rates)$/.test(o.subj.head || '') && !T.slice(vg.idx + 1, lim).some((x) => isW(x, 'down') || isW(x, 'up') || isW(x, 'on'))) sense = { particle: '', core: /^(?:drop|fall)$/.test(L) ? '下がる' : '上がる', tr: false };""",
    """|number|level|levels|rate|rates|score|scores|grade|grades|sales|value|values|average|salary|income|wages)$/.test(o.subj.head || '') && !T.slice(vg.idx + 1, lim).some((x) => isW(x, 'down') || isW(x, 'up') || isW(x, 'on'))) sense = { particle: '', core: /^(?:drop|fall)$/.test(L) ? '下がる' : '上がる', tr: false };""")

rep("""          return postMod({ ja: mOut + uO + '中' + nOut + uO + 'の' + innerO.ja.replace(/(?:人々|たち)$/, (m0) => (innerO.head === 'people' ? '人' : '')), end: innerO.end, head: innerO.head, an: innerO.an, pl: nOut > 1 }, lim, o);""",
    """          return postMod({ ja: mOut + uO + '中' + nOut + uO + (/^(?:people|person|persons)$/.test(innerO.head || '') ? '' : 'の' + innerO.ja.replace(/(?:人々|たち)$/, '')), end: innerO.end, head: innerO.head, an: innerO.an, pl: nOut > 1 }, lim, o);""")

# It costs twice as much as that one → それはあれの2倍の値段だ
rep("""    // Hi, Ken. → こんにちは、ケン""",
    """    // It costs half as much as the old one → それは古いものの半分の値段だ
    {
      const qC = T.findIndex((x, q) => q > 0 && q < b && /^(?:cost|costs)$/.test(x.w || ''));
      if (qC > 0) {
        let kC = qC + 1, multC = '';
        if (isW(T[kC], 'twice')) { multC = '2倍'; kC++; } else if (isW(T[kC], 'half')) { multC = '半分'; kC++; } else { const nmC = parseNumAt(kC, b); if (nmC && isW(T[nmC.end], 'times')) { multC = nmC.ja + '倍'; kC = nmC.end + 1; } }
        if (multC && seq(kC, ['as', 'much', 'as']) && kC + 3 < b) {
          const sC = np(0, qC, {});
          const nC = sC && sC.end === qC ? np(kC + 3, b, { noRel: true }) : null;
          if (nC && nC.end === b) {
            const pastC = T[qC].w === 'cost' && !!sC && !sC.pl && !/^(?:i|you|we|they)$/.test(sC.pron || '');
            return { ok: true, ja: sC.ja + 'は' + nC.ja + 'の' + multC + 'の値段' + (pastC ? 'だった' : 'だ') + '。', sp: '', names: ['as-as'], sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() };
          }
          reset(tokens);
        }
      }
    }
    // Hi, Ken. → こんにちは、ケン""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
