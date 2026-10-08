import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# 1) ペットなどの名前
rep("""  const NAME_JA = dic({ takao: '高尾',""",
    """  const NAME_JA = dic({ max: 'マックス', coco: 'ココ', charlie: 'チャーリー', bella: 'ベラ', luna: 'ルナ', milo: 'マイロ', leo: 'レオ', rocky: 'ロッキー', chibi: 'チビ', kotaro: 'コタロウ', takao: '高尾',""")

# 2) One rainy afternoon, → ある雨の午後、（one + 形容詞 + 時の名詞 + コンマ）
rep("""      // Judging from his accent, …（〜から判断すると、）
""",
    """      if (t.w === 'one' && a + 3 < b && T[a + 1].k === 'w' && !T[a + 1].cap) {
        const cOne = T.findIndex((x, q) => q >= a + 2 && q <= a + 4 && isP(x, ','));
        if (cOne > 0 && cOne + 1 < b && TIMEN[T[cOne - 1].w]) {
          const mOne = mark();
          const nOne = np(a + 1, cOne, { noRel: true });
          if (nOne && nOne.end === cOne) { lead += 'ある' + nOne.ja + '、'; a = cOne + 1; continue; }
          fail(mOne);
        }
      }
      // Judging from his accent, …（〜から判断すると、）
""")

# 3) Kenji named the kitten Lucky → 子ネコをラッキーと名づけた（name / call + 目的語 + 形容詞にもなる名前）
rep("""    // 呼びかけ: Ken, come here.""",
    """    if (b > 3 && !tokens.__nmC) {
      const WNAME = { lucky: 'ラッキー', happy: 'ハッピー', sunny: 'サニー', cookie: 'クッキー', candy: 'キャンディ', snow: 'スノー', star: 'スター', honey: 'ハニー', ginger: 'ジンジャー', pepper: 'ペッパー', buddy: 'バディ', daisy: 'デイジー', lily: 'リリー', rose: 'ローズ', ruby: 'ルビー', sky: 'スカイ', blue: 'ブルー', smoky: 'スモーキー', fluffy: 'フラッフィー', spot: 'スポット', tiger: 'タイガー', shadow: 'シャドウ', angel: 'エンジェル', prince: 'プリンス', princess: 'プリンセス', king: 'キング', chocolate: 'チョコ', mocha: 'モカ', latte: 'ラテ', maple: 'メープル', peach: 'ピーチ', cherry: 'チェリー', lemon: 'レモン', kiwi: 'キウイ', mango: 'マンゴー', bean: 'ビーン', muffin: 'マフィン', biscuit: 'ビスケット', pudding: 'プリン' };
      const kNm = T.findIndex((x, q) => q > 0 && /^(?:name|names|named|naming|call|calls|called|calling)$/.test(x.w || ''));
      const tlN = T[b - 1];
      if (kNm > 0 && b - 1 > kNm + 1 && tlN && tlN.k === 'w' && tlN.cap && (WNAME[tlN.w] || KATA_N[tlN.w]) && !NAME_JA[tlN.w]) {
        const tNm = tokens.map((x) => Object.assign({}, x));
        tNm[b - 1] = Object.assign({}, tNm[b - 1], { w: 'zqpetname', s: WNAME[tlN.w] || KATA_N[tlN.w], cap: true });
        tNm.__nmC = true;
        const rNm = translate1(tNm);
        reset(tokens);
        if (rNm && rNm.ok) return rNm;
      }
    }
    // 呼びかけ: Ken, come here.""")

# 4) It was wet and shaking → 濡れていて、震えていた（be + 形容詞 + and + 現在分詞は be を補う）
rep("""    // 呼びかけ: Ken, come here.""",
    """    if (b > 4 && !tokens.__beAI) {
      const kAI = T.findIndex((x, q) => q >= 2 && isW(x, 'and') && T[q + 1] && T[q + 1].k === 'w' && !!vc(T[q + 1], ['ing']) && !nounC(T[q + 1]) && T[q - 1] && T[q - 1].k === 'w' && !!adjC(T[q - 1]) && T[q - 2] && T[q - 2].k === 'w' && BE[T[q - 2].w]);
      if (kAI > 0) {
        const tAI = tokens.slice(0, kAI + 1).concat([Object.assign({}, tokens[kAI - 2])]).concat(tokens.slice(kAI + 1)).map((x, k) => Object.assign({}, x, { i: k }));
        tAI.__beAI = true;
        const rAI = translate1(tAI);
        reset(tokens);
        if (rAI && rAI.ok) return rAI;
      }
    }
    // 呼びかけ: Ken, come here.""")

# 5) shake（自動詞・生き物）→ 震える
rep("""      else if (L === 'skip' && /(?:^| )(?:breakfast|lunch|dinner|meal|meals|supper)$/.test(oh)) sense = { particle: 'を', core: '抜く', tr: true };""",
    """      else if (L === 'skip' && /(?:^| )(?:breakfast|lunch|dinner|meal|meals|supper)$/.test(oh)) sense = { particle: 'を', core: '抜く', tr: true };""")

rep("""    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""",
    """    ja = ja.replace(/家まで([^、。]{0,8}?)歩い(た|て|ていた|ている|ていると)/g, (m0, a0, b0) => a0 + '歩いて帰っ' + b0.replace(/^て/, 'て').replace(/^た$/, 'た')).replace(/(ている|ていた)と、(?:彼|彼女)が([^、。]{0,10}?)(音|声|物音|叫び声|悲鳴|音楽)を聞いた/, '$1と、$2$3が聞こえた').replace(/いくらかの(?:暖かい|温かい)(牛乳|ミルク|お茶|スープ|コーヒー)/g, '温かい$1').replace(/暖かい(牛乳|ミルク|お茶|スープ|コーヒー|食事|料理)/g, '温かい$1');   // Kenji was walking home from school when he heard a strange sound → 学校から歩いて帰っていると、奇妙な音が聞こえた / gave it some warm milk → 温かい牛乳を与えた
    if (tokens.some((x) => /^(?:shaking|shook|shake|shakes)$/.test(x.w || '')) && tokens.some((x) => /^(?:kitten|kittens|puppy|puppies|dog|dogs|cat|cats|bird|birds|boy|girl|child|children|baby|he|she|i|we|they|it|hands|hand|legs|knees|body|voice)$/.test(x.w || '')) && !tokens.some((x) => /^(?:hands|hand)$/.test(x.w || '') && false)) ja = ja.replace(/揺れて(い|お)/g, '震えて$1').replace(/揺れた/g, '震えた');   // The kitten was wet and shaking → 震えていた
    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
