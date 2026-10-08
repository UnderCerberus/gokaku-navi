import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""    // Little is known about the disease → その病気についてはほとんど知られていない
""", """    // Much is known about the disease → その病気については多くのことが知られている / Much has been written about him → 彼については多くのことが書かれてきた
    if (b > 4 && (isW(T[0], 'much') || seq(0, ['a', 'lot']) || seq(0, ['a', 'great', 'deal']))) {
      const k0Mk = isW(T[0], 'much') ? 1 : (isW(T[1], 'lot') ? 2 : 3);
      const perfMk = seq(k0Mk, ['has', 'been']) || seq(k0Mk, ['had', 'been']);
      const kVMk = perfMk ? k0Mk + 2 : (T[k0Mk] && /^(?:is|was)$/.test(T[k0Mk].w || '') ? k0Mk + 1 : -1);
      const VMK = { known: '知られて', said: '言われて', written: '書かれて', discussed: '議論されて', reported: '報じられて', published: '発表されて' };
      if (kVMk > 0 && T[kVMk] && VMK[T[kVMk].w] && isW(T[kVMk + 1], 'about')) {
        const nMk = np(kVMk + 2, b, { noRel: true });
        if (nMk && nMk.end === b) return { ok: true, ja: nMk.ja + 'については多くのことが' + VMK[T[kVMk].w] + (perfMk ? 'きた' : (isW(T[k0Mk], 'was') ? 'いた' : 'いる')) + '。', sp: '', names: perfMk ? ['passive', 'perfect'] : ['passive'], sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() };
        reset(tokens);
      }
    }
    // Much remains to be done. / A lot remains to be learned about the brain. → まだやるべきことがたくさん残っている（There is still much to do に置き換えて下の規則で訳す）
    if (b > 4 && !tokens.__remQ) {
      const kRq = T.findIndex((x, q) => q >= 1 && q <= 4 && /^(?:remain|remains|remained)$/.test(x.w || '') && isW(T[q + 1], 'to') && isW(T[q + 2], 'be') && !!vc(T[q + 3], ['pp']));
      if (kRq > 0 && /^(?:much|a|lots|many|so|plenty)$/.test(T[0].w || '')) {
        const lemRq = vc(T[kRq + 3], ['pp']).lemma;
        const mkRq = (w0, src) => Object.assign({}, src, { w: w0, s: w0, raw: w0, cap: false, first: false, an: undefined, oi: undefined });
        const tRq = [mkRq('there', tokens[0]), mkRq(T[kRq].w === 'remained' ? 'was' : 'is', tokens[kRq]), mkRq('still', tokens[kRq])].concat(tokens.slice(0, kRq).map((x) => Object.assign({}, x, { cap: false, first: false })), [tokens[kRq + 1], mkRq(lemRq, tokens[kRq + 3])], tokens.slice(kRq + 4)).map((x, k) => Object.assign({}, x, { i: k, first: k === 0 }));
        tRq.__remQ = true;
        const rRq = translate1(tRq);
        reset(tokens);
        if (rRq && rRq.ok && /残って/.test(rRq.ja)) return rRq;
      }
    }
    // I have a lot to do today. / We still have much to learn about the brain. / There is so much to see. → 今日やることがたくさんある / まだ脳について学ぶことがたくさんある / 見るものがとてもたくさんある
    if (b > 3 && !tokens.__haveQ) {
      const QW = [[['a', 'great', 'deal'], 'たくさん'], [['a', 'lot', 'of', 'things'], 'たくさん'], [['lots', 'of', 'things'], 'たくさん'], [['so', 'many', 'things'], 'とてもたくさん'], [['many', 'things'], 'たくさん'], [['a', 'few', 'things'], 'いくつか'], [['several', 'things'], 'いくつか'],
        [['a', 'lot', 'of', 'work'], 'たくさん', '仕事'], [['lots', 'of', 'work'], 'たくさん', '仕事'], [['so', 'much', 'work'], 'とてもたくさん', '仕事'], [['much', 'work'], 'たくさん', '仕事'],
        [['a', 'lot'], 'たくさん'], [['lots'], 'たくさん'], [['so', 'much'], 'とてもたくさん'], [['too', 'much'], '多すぎる'], [['much'], 'たくさん'], [['plenty'], 'たくさん'], [['very', 'little'], 'ほとんどない'], [['so', 'little'], 'ほとんどない'], [['little'], 'ほとんどない'], [['more'], 'もっと'], [['something'], ''], [['nothing'], '何もない']];
      const qAt = (k) => {
        for (let q = 0; q < QW.length; q++) {
          const ws = QW[q][0];
          if (seq(k, ws) && !(!/^(?:things|work)$/.test(ws[ws.length - 1]) && isW(T[k + ws.length], 'of'))) return { n: ws.length, ja: QW[q][1], noun: QW[q][2] || '' };
        }
        return null;
      };
      let kQ = -1, subjQ = null, negQ = false, pastQ = false, stillQ = false, thereQ = false;
      if (isW(T[0], 'there') && T[1] && /^(?:is|are|was|were)$/.test(T[1].w || '')) { thereQ = true; pastQ = /^(?:was|were)$/.test(T[1].w); kQ = 2; }
      else {
        const kH = T.findIndex((x, q) => q >= 1 && q <= 6 && x.k === 'w' && /^(?:have|has|had)$/.test(x.w));
        if (kH > 0 && !isW(T[kH + 1], 'to') && !isW(T[kH + 1], 'been') && !isW(T[kH + 1], 'got')) {
          let kS = kH;
          if (kS > 1 && /^(?:still|also|already)$/.test(T[kS - 1].w || '')) { stillQ = isW(T[kS - 1], 'still'); kS--; }
          if (kS > 2 && isW(T[kS - 1], 'not') && /^(?:do|does|did)$/.test(T[kS - 2].w || '')) { negQ = true; pastQ = T[kS - 2].w === 'did'; kS -= 2; }
          subjQ = np(0, kS, { noRel: true });
          if (subjQ && subjQ.end === kS && !subjQ.clause) { kQ = kH + 1; if (T[kH].w === 'had') pastQ = true; }
          else subjQ = null;
        }
      }
      if (kQ > 0) {
        if (isW(T[kQ], 'still')) { stillQ = true; kQ++; }
        const qQ = qAt(kQ);
        let kTo = qQ ? kQ + qQ.n : -1;
        const leftQ = kTo > 0 && isW(T[kTo], 'left');
        if (leftQ) kTo++;
        if (qQ && isW(T[kTo], 'to') && T[kTo + 1] && !isW(T[kTo + 1], 'be') && vc(T[kTo + 1], ['base']) && !(isW(T[kTo + 1], 'do') && isW(T[kTo + 2], 'with')) &&
          !(negQ && /^(?:ほとんどない|何もない|もっと|)$/.test(qQ.ja)) && !(qQ.ja === '何もない' && !leftQ) && !(thereQ && qQ.ja === '')) {
          const gapQ = { type: 'np', rel: true, used: false, ante: 'thing' };
          const infQ = vpNonfin(kTo + 1, b, 'base', { gap: gapQ });
          if (infQ && infQ.end === b && verbal(infQ.pred) && !infQ.neg) {
            const lemQ = (vc(T[kTo + 1], ['base']) || {}).lemma || T[kTo + 1].w;
            const remQ = !!tokens.__remQ;
            let sQ = vpJoin(infQ, 'dict');
            if (lemQ === 'do' && /^[^をがに]*する$/.test(sQ)) sQ = sQ.replace(/する$/, 'やる');
            const nQ = qQ.noun || (/^(?:eat|drink|read|wear|buy|see|write|cook|watch|offer)$/.test(lemQ) ? 'もの' : 'こと');
            const lowQ = negQ || /^(?:ほとんどない|何もない)$/.test(qQ.ja);
            let prQ;
            if (negQ) prQ = 'あまりない';
            else if (qQ.ja === 'ほとんどない') prQ = leftQ || remQ ? 'ほとんど残っていない' : 'ほとんどない';
            else if (qQ.ja === '何もない') prQ = '何も残っていない';
            else if (qQ.ja === '多すぎる') prQ = '多すぎる';
            else prQ = qQ.ja + (leftQ || remQ ? '残っている' : 'ある');
            if (pastQ) prQ = prQ.replace(/ない$/, 'なかった').replace(/いる$/, 'いた').replace(/すぎる$/, 'すぎた').replace(/ある$/, 'あった');
            name('inf-adj');
            if (thereQ && !remQ) name('there');
            return { ok: true, ja: (subjQ ? subjQ.ja + 'は' : '') + (stillQ && !lowQ ? 'まだ' : '') + sQ + (remQ ? 'べき' : '') + nQ + (lowQ ? 'は' : 'が') + prQ + '。', sp: '', names: NAMES.slice(), sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() };
          }
        }
      }
      reset(tokens);
    }
    // The rule remains in effect. / The ban is still in effect. → 規則は引き続き有効だ / 禁止はまだ有効だ（in effect = 有効で）
    if (b > 3 && !tokens.__inEff) {
      const kIe = T.findIndex((x, q) => q >= 2 && isW(x, 'in') && isW(T[q + 1], 'effect') && /^(?:is|are|was|were|be|been|remain|remains|remained|stay|stays|stayed|still)$/.test(T[q - 1].w || '') && (q + 2 >= b || T[q + 2].k === 'p' || /^(?:until|since|for|in|from|across|throughout|today|now)$/.test(T[q + 2].w || '')));
      if (kIe > 0) {
        const tIe = tokens.slice(0, kIe).concat([Object.assign({}, tokens[kIe], { w: 'valid', s: 'valid', raw: 'valid', an: undefined, oi: undefined })], tokens.slice(kIe + 2)).map((x, k) => Object.assign({}, x, { i: k }));
        tIe.__inEff = true;
        const rIe = translate1(tIe);
        reset(tokens);
        if (rIe && rIe.ok) return Object.assign({}, rIe, { ja: rIe.ja.replace(/有効なままだ/, '引き続き有効だ') });
      }
    }
    // Little is known about the disease → その病気についてはほとんど知られていない
""")

# The problem remains difficult to solve. → 問題はまだ解きにくい（remain + 難易の形容詞 + to も are still に置き換える）
rep("""|skeptical|cautious)$/.test(T[q + 1].w || '') && isW(T[q + 2], 'to'));""",
    """|skeptical|cautious|difficult|hard|easy|impossible|tough)$/.test(T[q + 1].w || '') && isW(T[q + 2], 'to'));""")

# Many people reported feeling tired. → 多くの人々は疲れていると報告した（補った they は訳さない）
rep("""        if (rRf && rRf.ok) return rRf;""",
    """        if (rRf && rRf.ok) return Object.assign({}, rRf, { ja: rRf.ja.replace(/彼らが/, '') });""")

rep("""    ja = ja.replace(/知識の隙間/g, '知識の空白')""",
    """    ja = ja.replace(/答えのないまま(だ|だった)/g, '未解決のまま$1').replace(/人気のあるままだった/g, '依然として人気があった').replace(/人気のあるままだ/g, '依然として人気がある');   // The question remains unanswered → 未解決のままだ / remains popular → 依然として人気がある
    ja = ja.replace(/知識の隙間/g, '知識の空白')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
