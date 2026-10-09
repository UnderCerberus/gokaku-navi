import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# 解析できなかった文に ; があれば、; で 2 文に分けて訳す（Not all bacteria are harmful; in fact, many …）
rep("""    if (!node) return null;
    let ja = qLead + node.out({ top: true });""",
    """    if (!node && !tokens.__scSplit) {
      const kSc2 = T.findIndex((x, q) => q > 1 && q < b - 2 && isP(x, ';'));
      if (kSc2 > 0) {
        const endSc2 = Object.assign({}, tokens[b] || tokens[b - 1], { s: '.', w: '.', k: 'p' });
        const tA = tokens.slice(0, kSc2).concat([endSc2]), tB = tokens.slice(kSc2 + 1, b).concat([endSc2]);
        tA.__scSplit = true; tB.__scSplit = true;
        const rA = translate1(tA), rB = rA && rA.ok ? translate1(tB) : null;
        reset(tokens);
        if (rA && rA.ok && rB && rB.ok) return Object.assign({}, rA, { ja: rA.ja.replace(/。$/, '') + '。' + rB.ja, names: (rA.names || []).concat(rB.names || []), unknown: (rA.unknown || []).concat(rB.unknown || []) });
      }
    }
    if (!node) return null;
    let ja = qLead + node.out({ top: true });""")

# not only A but also B + に・と などの助詞の動詞 → AだけでなくBにも（affects not only our health but also our mood → 気分にも影響する）
rep("""        if (b2) { name('not-only'); return { ja: a2.ja + 'だけでなく' + b2.ja + 'も', end: b2.end, an: a2.an && b2.an, pl: true, bare: true, coord: true }; }""",
    """        if (b2) { name('not-only'); return { ja: a2.ja + 'だけでなく' + b2.ja + 'も', end: b2.end, an: a2.an && b2.an, pl: true, bare: true, coord: true, notOnlyA: a2.ja, notOnlyB: b2.ja }; }""")
rep("""    if (n.bare) return n.ja;
    return n.ja + particle;
  }""",
    """    if (n.notOnlyB && particle && !/^(?:を|が|は)$/.test(particle)) return n.notOnlyA + 'だけでなく' + n.notOnlyB + particle + 'も';
    if (n.bare) return n.ja;
    return n.ja + particle;
  }""")

# 主語が人の they / 人の複数名詞の文の themselves は「自分」（それら自身・彼ら自身 にしない）
rep("""    if (n && n.pron === 'one' && n.ja === '人' && particle === 'を') n = Object.assign({}, n, { ja: '1つ' });""",
    """    if (n && n.pron === 'one' && n.ja === '人' && particle === 'を') n = Object.assign({}, n, { ja: '1つ' });
    if (n && n.pron === 'themselves' && /^(?:それら|彼ら)自身$/.test(n.ja || '') && (n.ja === '彼ら自身' || T.some((x) => x.k === 'w' && /^(?:people|they|students|children|teenagers|parents|adults|users|workers|employees|we)$/.test(x.w)))) n = Object.assign({}, n, { ja: '自分' });""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
