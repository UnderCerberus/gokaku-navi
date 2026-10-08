import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# 1) 天気がすてきだ → 天気がいい の置換が活用語尾を残していた（天気がいいったら）。活用に合わせる
rep(""".replace(/天気がすてきだ/g, '天気がいい')""",
    """.replace(/天気がすてきだったら/g, '天気がよかったら').replace(/天気がすてきだった/g, '天気がよかった').replace(/天気がすてきなら/g, '天気がよければ').replace(/天気がすてきで(?=、|は)/g, '天気がよくて').replace(/天気がすてきだ(?!っ)/g, '天気がいい')""")

# 2) except when … → 〜ときを除いて
rep("""  const MSUB = ['even if', 'even though', 'even when', 'just as',""",
    """  const MSUB = ['except when', 'even if', 'even though', 'even when', 'just as',""")
rep("""      case 'in case': return S('attr', false) + '場合に備えて、';""",
    """      case 'in case': return S('attr', false) + '場合に備えて、';
      case 'except when': return S('attr', false) + 'ときを除いて、';""")

# 3) if you like / if you want（目的語なし）→ よかったら
rep("""      case 'if':
        if (sc.pred && /たい$/.test(sc.pred.plain()) && !sc.past && !sc.neg) return S('attr') + 'なら、';""",
    """      case 'if':
        if (sc.subj && sc.subj.pron === 'you' && !(sc.parts || []).length && sc.pred && /^(?:好む|好きだ|欲しい|望む|好きである|願う)$/.test(sc.pred.plain()) && !sc.past && !sc.neg && !sc.modal) return 'よかったら、';   // you can bring a dessert if you like
        if (sc.pred && /たい$/.test(sc.pred.plain()) && !sc.past && !sc.neg) return S('attr') + 'なら、';""")

# 4) I don't think he is right → 彼が正しいとは思わない（否定の think / believe は「〜とは思わない」。だろう は落とす）
rep("""        if (/^こと/.test(mkT)) tStr = tStr.replace(/だ$/, 'である');                                // 正直が重要であることに同意する""",
    """        if (/^こと/.test(mkT)) tStr = tStr.replace(/だ$/, 'である');                                // 正直が重要であることに同意する
        if (mkT === 'と' && vg.neg && /^(?:think|suppose|expect|imagine)$/.test(L) && !vg.past && !vg.perfect && !vg.modal) { name('that-clause'); return done(vg, thatCore(vg, L), st, tc.end, 'SVO', o, [tStr.replace(/だろう$/, '') + 'とは']); }""")

# 5) 語義: follow the conversation → 会話についていく / lack money → お金が不足している / develop cancer → がんを発症する
rep("""      else if (L === 'develop' && /(?:^| )(?:photo|photos|film|films|picture|pictures|photograph|photographs)$/.test(oh))""",
    """      else if (L === 'follow' && /(?:^| )(?:conversation|conversations|lecture|lectures|speech|speeches|explanation|explanations|argument|arguments|discussion|discussions|plot|talk|talks|lesson|lessons|reasoning|logic)$/.test(oh)) sense = { particle: 'に', core: 'ついていく', tr: true };   // could not follow the conversation → 会話についていけなかった
      else if (L === 'follow' && objs[0].pron && /^(?:him|her|them|me|you|us)$/.test(objs[0].pron) && T.some((x) => /^(?:spoke|speak|speaks|speaking|talked|talk|talks|talking|explained|explain|explains)$/.test(x.w || ''))) { sense = { particle: 'に', core: 'ついていく', tr: true }; objs[0] = Object.assign({}, objs[0], { ja: objs[0].ja + 'の話' }); }   // spoke so quickly that I could not follow her → 彼女の話についていけなかった
      else if (L === 'lack' && !vg.passive) sense = { particle: 'が', core: '不足している', tr: true };   // we lack resources → 資源が不足している
      else if (L === 'develop' && /(?:^| )(?:cancer|diabetes|disease|diseases|illness|illnesses|dementia|allergy|allergies|asthma|symptoms|infection|infections|depression|heart disease)$/.test(oh)) sense = { particle: 'を', core: '発症する', tr: true };   // develop cancer → がんを発症する
      else if (L === 'develop' && /(?:^| )(?:photo|photos|film|films|picture|pictures|photograph|photographs)$/.test(oh))""")

# 6) be less likely to do → 〜する可能性がより低い
rep("""    if (kk + 2 < lim && (isW(T[kk], 'most') || isW(T[kk], 'more') || (isW(T[kk], 'the') && isW(T[kk + 1], 'most')))) {
      const kD = isW(T[kk], 'the') ? kk + 1 : kk;
      if (kD + 1 < lim && !!adjC(T[kD + 1]) && !nounC(T[kD + 1])) { degP = T[kD].w === 'most' ? '最も' : 'より'; kk = kD + 1; }
    }""",
    """    let lessP = false;
    if (kk + 2 < lim && (isW(T[kk], 'most') || isW(T[kk], 'more') || (isW(T[kk], 'the') && isW(T[kk + 1], 'most')) || (isW(T[kk], 'less') && isW(T[kk + 1], 'likely')))) {
      const kD = isW(T[kk], 'the') ? kk + 1 : kk;
      if (kD + 1 < lim && !!adjC(T[kD + 1]) && !nounC(T[kD + 1])) { degP = T[kD].w === 'most' ? '最も' : 'より'; lessP = T[kD].w === 'less'; kk = kD + 1; }
    }""")
rep("""        if (degP && it.it && it.it.phrase === 'be likely to do') core = P(fillDo('〜する可能性が' + degP + '高い', v), 'i');""",
    """        if (degP && it.it && it.it.phrase === 'be likely to do') core = P(fillDo('〜する可能性が' + degP + (lessP ? '低い' : '高い'), v), 'i');""")

# 7) turned out to be difficult to carry out: tough の形容詞 + to 不定詞は be の補語として読む（目的の不定詞にしない）
rep("""      const aTo = adjAt(i + 3, lim);
      if (aTo) {""",
    """      const aTo0 = adjAt(i + 3, lim);
      const aTo = aTo0 && !(isW(T[aTo0.end], 'to') && TOUGH[(adjC(T[aTo0.idx]) || {}).lemma]) ? aTo0 : null;
      if (aTo) {""")

# 8) The problem is not that A but that B → 問題は A ということではなく、B ということだ
rep("""    if (isW(t, 'that') && j + 2 < lim) {
      const ct = sentence(j + 1, lim, { sub: true });""",
    """    if (isW(t, 'that') && j + 2 < lim) {
      if (vg.neg) {
        const yB = T.findIndex((x, q) => q > j + 2 && q < lim - 2 && isW(x, 'but') && isW(T[q + 1], 'that'));
        if (yB > 0) {
          const mNB = mark();
          const c1 = sentence(j + 1, isP(T[yB - 1], ',') ? yB - 1 : yB, { sub: true });
          const c2 = c1 ? sentence(yB + 2, lim, { sub: true }) : null;
          if (c2) { name('that-clause'); name('not-but'); vg.neg = false; st.neg = false; return fin(P(c1.out({ part: 'が' }) + 'ということではなく、' + c2.out({ part: 'が' }) + 'ということだ', 'da'), lim); }
          fail(mNB);
        }
      }
      const ct = sentence(j + 1, lim, { sub: true });""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
