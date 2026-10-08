import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Do you know when he left? → 彼がいつ出発したか知っていますか（know / tell me の後ろの when は間接疑問）
rep("""        if (!(T[x].k === 'w' && /^(?:if|when|before|after|because|while|until)$/.test(T[x].w)) || isP(T[x - 1], ',') || (T[x].w === 'if' && !WH[T[a].w] && /^(?:know|wonder|ask|see|tell)$/.test((T[x - 1] || {}).w || ''))) continue;""",
    """        if (!(T[x].k === 'w' && /^(?:if|when|before|after|because|while|until)$/.test(T[x].w)) || isP(T[x - 1], ',') || ((T[x].w === 'if' || T[x].w === 'when') && !WH[T[a].w] && (/^(?:know|wonder|ask|see|tell|remember|forget|understand|explain|decide|check)$/.test((T[x - 1] || {}).w || '') || (/^(?:me|us|him|her|them)$/.test((T[x - 1] || {}).w || '') && /^(?:tell|ask|show)$/.test((T[x - 2] || {}).w || ''))))) continue;""")

# Only after the exam did I realize my mistake → 試験の後になって初めて、私は自分の間違いに気づいた
rep("""        if (/^(?:after|when|once|if)$/.test(kw)) {
          scOA = sentence(a + 2, x, { sub: true });
          if (scOA) leadOA = kw === 'if' ? scOA.out({ part: 'が', form: 'tara' }) + '初めて、' : scOA.out({ part: 'が', form: 'te' }) + '初めて、';
        }""",
    """        if (/^(?:after|when|once|if)$/.test(kw)) {
          scOA = sentence(a + 2, x, { sub: true });
          if (scOA) leadOA = kw === 'if' ? scOA.out({ part: 'が', form: 'tara' }) + '初めて、' : scOA.out({ part: 'が', form: 'te' }) + '初めて、';
          else if (kw === 'after') { fail(mOA); const nOA = np(a + 2, x, {}); if (nOA && nOA.end === x) leadOA = nOA.ja + 'の後になって初めて、'; }
        }""")

# This is the reason I came here → これは私がここに来た理由だ（理由・時・日などの名詞 + 節。関係副詞の省略）
rep("""    if (/^(?:i|you|he|she|we|they|it)$/.test(w) && j + 1 < e) {
      for (let q = 0; q < ends.length; q++) {
        const gap3 = { type: 'np', rel: true, used: false, ante: node.head };""",
    """    if (/^(?:i|you|he|she|we|they|it)$/.test(w) && j + 1 < e && !node.pron && /^(?:reason|time|day|year|moment|way|place|week|night|morning|evening|summer|winter|weekend|minute|hour|month)$/.test(node.head || '') && T[j + 1].k === 'w' && !!(vc(T[j + 1], ['past', 'base', '3sg']) || MODAL[T[j + 1].w] || BE[T[j + 1].w] || HAVE[T[j + 1].w] || DO[T[j + 1].w])) {
      for (let q = 0; q < ends.length; q++) {
        if (ends[q] !== e) continue;
        const gap7 = { type: 'np', rel: true, used: false, ante: node.head };
        const cl7g = clause(j, ends[q], { gap: gap7, sub: true });
        const okGap7 = cl7g && gap7.used && /^(?:time|day|year|week|minute|hour|month)$/.test(node.head) && T.slice(j + 1, ends[q]).some((x) => x.k === 'w' && /^(?:spent|spend|spends|had|have|has|wasted|waste|lost|enjoyed|enjoy|took|take|needed|need|chose|choose|picked|set|saved)$/.test(x.w));
        if (okGap7) { e = ends[q]; return fin(cl7g.out({ part: 'が', form: 'attr' }), 'relative'); }
        fail(m);
        const cl7 = clause(j, ends[q], { sub: true });
        if (cl7) { e = ends[q]; const r7 = fin(cl7.out({ part: 'が', form: 'attr' }), 'rel-adv'); if (node.head === 'way') r7.ja = r7.ja.replace(/道$/, 'やり方'); if (node.head === 'time' && !/[0-9０-９]/.test(r7.ja)) r7.ja = r7.ja.replace(/時間$/, '時'); return r7; }
        fail(m);
      }
    }
    if (/^(?:i|you|he|she|we|they|it)$/.test(w) && j + 1 < e) {
      for (let q = 0; q < ends.length; q++) {
        const gap3 = { type: 'np', rel: true, used: false, ante: node.head };""")

# It is not too much to say that he is a genius → 彼は天才だと言っても過言ではない / which bus to take → どのバスに乗るべきか
rep("""    // Hi, Ken. → こんにちは、ケン""",
    """    // It is not too much to say that he is a genius → 彼は天才だと言っても過言ではない
    if (seq(0, ['it', 'is', 'not', 'too', 'much', 'to', 'say', 'that']) && b > 9) {
      const tsT = withTokens(T, () => sentence(8, b, { sub: true }));
      if (tsT) return { ok: true, ja: tsT.out({ part: 'が' }).replace(/だろう$/, '') + 'と言っても過言ではない。', sp: '', names: ['that-clause', 'idiom'], sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() };
      reset(tokens);
    }
    // Hi, Ken. → こんにちは、ケン""")

rep("""    ja = ja.replace(/誰か([^、。]{1,16}?)人を持って(いる|いた)/, '$1人が$2');""",
    """    ja = ja.replace(/誰か([^、。]{1,16}?)人を持って(いる|いた)/, '$1人が$2').replace(/どの(バス|電車|列車|飛行機|便|地下鉄|タクシー)を(?:かかる|取る|とる|持って行く)(べきか|か)/, 'どの$1に乗る$2');   // I don't know which bus to take → どのバスに乗るべきか分からない""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
