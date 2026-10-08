import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# 1) 動名詞の意味上の主語（所有格 + -ing）
rep("""    const first = np1(i, lim, o);
    if (!first) return fail(m);
""", """    // 動名詞の意味上の主語: Do you mind my opening the window? / I'm sure of his passing the exam → 私が窓を開けること / 彼が試験に合格すること
    // I'm proud of my son being a doctor → 私の息子が医者であること
    if (t.k === 'w' && /^(?:my|your|his|her|its|our|their)$/.test(t.w) && i + 1 < lim && T[i + 1].k === 'w') {
      const SBG = { my: '私', your: 'あなた', his: '彼', her: '彼女', its: 'それ', our: '私たち', their: '彼ら' };
      const pvG = T[i - 1];
      const ctxG = !pvG || pvG.k === 'p' || !!PREP[pvG.w] || /^(?:mind|minds|minded|like|likes|liked|dislike|dislikes|disliked|imagine|imagined|remember|remembered|appreciate|appreciated|forgive|forgave|excuse|understand|understood|resent|resented|regret|regretted|enjoy|enjoyed|hate|hated|love|loved|approve|prevent|prevented|stop|stopped)$/.test(pvG.w || '');
      const nxG = T[i + 1], aftG = T[i + 2];
      const objNxG = !!aftG && aftG.k === 'w' && (DET[aftG.w] !== undefined || aftG.w === 'it' || (!!PRON[aftG.w] && !PRON[aftG.w].sub) || /^(?:late|early|here|there|home|back|so|too|very|alone|abroad|up|out|away)$/.test(aftG.w));
      if (ctxG && /ing$/.test(nxG.w) && ingVerb(i + 1, lim) && (!nounC(nxG) || objNxG)) {
        const mG = mark();
        const gG = vpNonfin(i + 1, lim, 'ing', { gerund: true });
        if (gG && verbal(gG.pred) && gG.end > i + 1) { name('gerund'); return { ja: SBG[t.w] + 'が' + vpJoin(gG, 'dict') + 'こと', end: gG.end, gerund: true, clause: true }; }
        fail(mG);
      }
      if (ctxG && !!nounC(nxG) && isW(aftG, 'being') && i + 3 < lim) {
        const mG2 = mark();
        const sG2 = np1(i, i + 2, { noRel: true, noPost: true });
        const gG2 = sG2 && sG2.end === i + 2 ? vpNonfin(i + 2, lim, 'ing', { gerund: true }) : null;
        if (gG2 && verbal(gG2.pred)) { name('gerund'); return { ja: sG2.ja + 'が' + vpJoin(gG2, 'dict').replace(/だ$/, 'である') + 'こと', end: gG2.end, gerund: true, clause: true }; }
        fail(mG2);
      }
    }
    const first = np1(i, lim, o);
    if (!first) return fail(m);
""")

# 2) find + O + 状態の形容詞・過去分詞（She found the store closed → 店が閉まっていると分かった）
rep("""      if (nSa && (nSa.an || /^(?:him|her|them|us|me|you)$/.test(nSa.pron || '')) && T[nSa.end]""",
    """      const STJ = { closed: '閉まっている', locked: '鍵がかかっている', broken: '壊れている', open: '開いている', empty: '空っぽだ', gone: 'なくなっている', missing: 'なくなっている', stolen: '盗まれている', dead: '死んでいる', full: 'いっぱいだ', finished: '終わっている', damaged: '傷んでいる', crowded: '混んでいる', deserted: '人けがない', flooded: '水浸しになっている', destroyed: '壊されている', famous: '有名になっている', unlocked: '鍵が開いている', ruined: 'だめになっている' };
      if (L === 'find' && nSa && nSa.end + 1 === lim && T[nSa.end] && STJ[T[nSa.end].w]) {
        name('svoc');
        const sbjF = /^(?:himself|herself|myself|themselves|ourselves|yourself)$/.test(T[i].w || '') ? '' : objStr(nSa, 'が', st);
        return done(vg, P(STJ[T[nSa.end].w] + 'と分かる', 'v5'), st, tail(nSa.end + 1, lim, st, o, vg), 'SVOC', o, sbjF ? [sbjF] : [], { noStative: true });
      }
      if (nSa && (nSa.an || /^(?:him|her|them|us|me|you)$/.test(nSa.pron || '')) && T[nSa.end]""")

# 3) 結果の不定詞（only to / woke up to find）・There is no use -ing
rep("""    // Much is known about the disease""", """    // She went to the store only to find it closed. / He studied hard only to fail the exam. → 店に行ったが、閉まっていた / 一生懸命勉強したが、結局試験に落ちた
    // He woke up to find himself famous. → 彼は目が覚めたら有名になっていた（結果の不定詞）
    if (b > 5 && !tokens.__onlyTo) {
      const kOy = T.findIndex((x, q) => q >= 3 && ((isW(x, 'only') && isW(T[q + 1], 'to') && !!vc(T[q + 2], ['base']) && !isW(T[q - 1], 'not') && (isP(T[q - 1], ',') || /^(?:find|discover|fail|learn|realize|realise|hear|be|lose|miss)$/.test((vc(T[q + 2], ['base']) || {}).lemma || ''))) || (isW(x, 'to') && isW(T[q + 1], 'find') && T[q - 1] && /^(?:up|home|back|woke|awoke|returned|arrived|came|got)$/.test(T[q - 1].w || ''))));
      if (kOy > 0) {
        const onlyY = isW(T[kOy], 'only');
        const kVy = onlyY ? kOy + 2 : kOy + 1;
        const eLy = isP(T[kOy - 1], ',') ? kOy - 1 : kOy;
        const tLy = tokens.slice(0, eLy).concat([{ k: 'p', w: '.', s: '.' }]).map((x, k) => Object.assign({}, x, { i: k }));
        tLy.__onlyTo = true;
        const rLy = translate1(tLy);
        reset(tokens);
        if (rLy && rLy.ok && /た。$/.test(rLy.ja)) {
          const mOy = mark();
          const STY = { closed: '閉まっていた', locked: '鍵がかかっていた', broken: '壊れていた', open: '開いていた', empty: '空っぽだった', gone: 'なくなっていた', missing: 'なくなっていた', stolen: '盗まれていた', dead: '死んでいた', full: 'いっぱいだった', finished: '終わっていた', crowded: '混んでいた', famous: '有名になっていた', flooded: '水浸しになっていた', destroyed: '壊されていた', ruined: 'だめになっていた' };
          let jRy = null;
          if (isW(T[kVy], 'find') && kVy + 2 < b && T[b - 1] && STY[T[b - 1].w]) {
            const oW = T[kVy + 1].w || '';
            if (/^(?:it|them|himself|herself|myself|themselves|ourselves|yourself)$/.test(oW) && kVy + 3 === b) jRy = STY[T[b - 1].w];
            else { const nOy = np(kVy + 1, b - 1, { noRel: true }); if (nOy && nOy.end === b - 1) jRy = nOy.ja + 'は' + STY[T[b - 1].w]; }
          }
          if (!jRy && onlyY) {
            const iOy = vpNonfin(kVy, b, 'base', {});
            if (iOy && iOy.end === b && verbal(iOy.pred) && !iOy.neg) jRy = '結局' + vpJoin(iOy, 'past');
          }
          if (jRy) {
            name('inf-adv');
            return { ok: true, ja: rLy.ja.replace(/。$/, '') + (onlyY ? 'が、' : 'ら、') + jRy + '。', sp: rLy.sp, names: rLy.names.concat(NAMES.filter((x) => rLy.names.indexOf(x) < 0)), sel: Object.assign({}, rLy.sel, selMap()), unknown: rLy.unknown.concat(UNK), idioms: rLy.idioms.concat(USED.filter((x) => rLy.idioms.indexOf(x) < 0)) };
          }
          fail(mOy);
        }
      }
    }
    // There is no use crying over spilt milk. / There's no use (in) worrying about it. → 〜しても無駄だ（It is no use -ing と同じに訳す）
    if (b > 4 && !tokens.__noUse && seq(0, ['there', 'is', 'no', 'use'])) {
      const kNu = isW(T[4], 'in') ? 5 : 4;
      if (T[kNu] && /ing$/.test(T[kNu].w || '') && !!vc(T[kNu], ['ing'])) {
        const tNu = [Object.assign({}, tokens[0], { w: 'it', s: 'It', raw: 'It', an: undefined, oi: undefined })].concat(tokens.slice(1, 4), tokens.slice(kNu)).map((x, k) => Object.assign({}, x, { i: k }));
        tNu.__noUse = true;
        const rNu = translate1(tNu);
        reset(tokens);
        if (rNu && rNu.ok) return rNu;
      }
    }
    // Much is known about the disease""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
