import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Many species, including elephants and dolphins, display … → ゾウやイルカを含む多くの種
rep("""      // 言い換えの同格: electronic books, or e-books, …（コンマで閉じるときだけ。閉じないなら or の並列）
""", """      // Many species, including elephants and dolphins, display … → ゾウやイルカを含む多くの種（コンマで挟んだ including）
      if (isP(t, ',') && !o.noApp && isW(T[j + 1], 'including') && j + 3 < lim && !node.pron) {
        let e3 = -1;
        for (let x = j + 3; x < lim; x++) { if (isP(T[x], ',')) { e3 = x; break; } }
        if (e3 > 0) {
          const mIc = mark();
          const nIc = np(j + 2, e3, { noRel: o.noRel });
          if (nIc && nIc.end === e3) { node = Object.assign({}, node, { ja: (nIc.coord && (nIc.ja.match(/と/g) || []).length === 1 ? nIc.ja.replace('と', 'や') : nIc.ja) + 'を含む' + node.ja, end: e3 + 1 }); continue; }
          fail(mIc);
        }
      }
      // 言い換えの同格: electronic books, or e-books, …（コンマで閉じるときだけ。閉じないなら or の並列）
""")

rep("""      // came from Asian countries such as China and South Korea""",
    """      // many species including elephants and dolphins → ゾウやイルカを含む多くの種（コンマなしの including）
      if (!o.pp && !o.noPost && isW(t, 'including') && j + 1 < lim && !node.pron && T[j + 1].k === 'w' && (DET[T[j + 1].w] !== undefined || !!nounC(T[j + 1]) || T[j + 1].cap)) {
        const mIn = mark();
        const nIn = np(j + 1, lim, { noRel: true });
        if (nIn && nIn.end > j + 1 && (nIn.end >= lim || T[nIn.end].k === 'p' || !!vc(T[nIn.end], ['base', '3sg', 'past']) || /^(?:are|is|were|was|have|has|had|can|could|will|would|may|might|must|should)$/.test(T[nIn.end].w || ''))) { node = Object.assign({}, node, { ja: (nIn.coord && (nIn.ja.match(/と/g) || []).length === 1 ? nIn.ja.replace('と', 'や') : nIn.ja) + 'を含む' + node.ja, end: nIn.end }); continue; }
        fail(mIn);
      }
      // came from Asian countries such as China and South Korea""")

# display behaviors → 行動を示す / challenge the view → 見方に疑問を投げかける
rep("""      else if (L === 'bring' && !vg.passive && objs.length === 1 && (objs[0].an || /^(?:him|her|them|me|us)$/""",
    """      else if (L === 'display' && /(?:^| )(?:behavior|behaviors|behaviour|behaviours|symptom|symptoms|sign|signs|emotion|emotions|characteristic|characteristics|trait|traits|interest|ability|abilities|talent|skill|skills|courage|intelligence|tendency|tendencies|pattern|patterns|response|responses|reaction|reactions|feeling|feelings|empathy|curiosity)$/.test(oh)) sense = { particle: 'を', core: '示す', tr: true };   // display behaviors that resemble grief → 悲しみに似た行動を示す
      else if (L === 'challenge' && !vg.passive && /(?:^| )(?:idea|ideas|belief|beliefs|view|views|theory|theories|assumption|assumptions|claim|claims|notion|notions|stereotype|stereotypes|myth|myths|conclusion|conclusions|wisdom)$/.test(oh)) sense = { particle: 'に', core: '疑問を投げかける', tr: true };   // they challenge the traditional view → 従来の見方に疑問を投げかける
      else if (L === 'bring' && !vg.passive && objs.length === 1 && (objs[0].an || /^(?:him|her|them|me|us)$/""")

# Elephants have been observed standing over … → ゾウが…立っているのが観察されている（受け身の知覚動詞 + -ing）
rep("""    // She went to the store only to find it closed.""",
    """    if (b > 4 && !tokens.__obsIng) {
      const kOb = T.findIndex((x, q) => q >= 1 && /^(?:observed|heard|photographed|filmed|spotted|found|noticed)$/.test(x.w || '') && q >= 2 && /^(?:was|were|is|are|been)$/.test(T[q - 1].w || '') && T[q + 1] && /ing$/.test(T[q + 1].w || '') && !!vc(T[q + 1], ['ing']));
      if (kOb > 0) {
        const perfOb = isW(T[kOb - 1], 'been');
        const kBe = perfOb ? kOb - 2 : kOb - 1;   // have been observed / was observed
        if (kBe >= 1 && (!perfOb || /^(?:have|has|had)$/.test(T[kBe].w || ''))) {
          const pastOb = perfOb ? false : /^(?:was|were)$/.test(T[kBe].w);
          const plOb = !(/^(?:has|was|is)$/.test(T[kBe].w || ''));
          const mkOb = (w0, src) => Object.assign({}, src, { w: w0, s: w0, raw: w0, an: undefined, oi: undefined });
          const tOb = tokens.slice(0, kBe).concat([mkOb(plOb ? 'were' : 'was', tokens[kBe])], tokens.slice(kOb + 1)).map((x, k) => Object.assign({}, x, { i: k }));
          tOb.__obsIng = true;
          const rOb = translate1(tOb);
          reset(tokens);
          const VOB = { observed: '観察', heard: '聞か', photographed: '撮影', filmed: '撮影', spotted: '目撃', found: '発見', noticed: '気づか' };
          if (rOb && rOb.ok && /ていた。$/.test(rOb.ja) && /^[^、。]+?は/.test(rOb.ja)) {
            const vOb = VOB[T[kOb].w];
            const passOb = /か$/.test(vOb) ? vOb + 'れ' : vOb + 'され';
            const jaOb = rOb.ja.replace(/^([^、。]+?)は/, '$1が').replace(/ていた。$/, 'ている') + 'のが' + passOb + (perfOb ? 'ている' : (pastOb ? 'た' : 'る')) + '。';
            return Object.assign({}, rOb, { ja: jaOb, names: rOb.names.concat(['passive']) });
          }
        }
      }
    }
    // She went to the store only to find it closed.""")

rep("""    ja = ja.replace(/一方で、また/g, '一方で、');""",
    """    ja = ja.replace(/一方で、また/g, '一方で、');
    ja = ja.replace(/唯一で(人間|日本)(である|だ)/g, '$1特有のもの$2').replace(/同じように([^、。をがはにで]{1,10})として/g, '$1と同じように');   // emotions are uniquely human → 人間特有のものだ / in the same way as humans → 人間と同じように
    ja = ja.replace(/([^、。をがは]{2,20})の(私たち|彼ら|彼女|彼|私|あなた|人々)の(理解|知識)/g, '$1についての$2の$3');   // our understanding of the inner lives of animals → 動物の内面生活についての私たちの理解
    if (tokens[0] && tokens[0].w === 'as') ja = ja.replace(/^([^、。]+?)(続く|進む|増える|成長する|発展する|上がる|変わる|広がる|進歩する|向上する|深まる|大きくなる|年をとる)ので、/, (m0, a0, v0) => (a0 === '研究が' && v0 === '続く' ? '研究が進む' : a0 + v0) + 'につれて、');   // As research continues → 研究が進むにつれて""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
