import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""'the sooner the better': '早ければ早いほどよい', """,
    """'the sooner the better': '早ければ早いほどよい', 'less is more': '少ないほうが豊かだ', """)

rep("""    // She went to the store only to find it closed.""",
    """    // He is the taller of the two. → 彼は2人のうちで背が高いほうだ / He is more a poet than a scholar. → 彼は学者というよりむしろ詩人だ
    if (b > 5) {
      const kTw = T.findIndex((x, q) => q >= 1 && q <= 5 && x.k === 'w' && /^(?:is|are|was|were|am)$/.test(x.w));
      if (kTw > 0 && isW(T[kTw + 1], 'the') && T[kTw + 2] && seq(kTw + 3, ['of', 'the', 'two']) && (kTw + 6 === b || (kTw + 7 === b && T[kTw + 6].k === 'w' && !!nounC(T[kTw + 6])))) {
        const aTw = adjC(T[kTw + 2]);
        const mTw = mark();
        const sTw = aTw && aTw.form === 'comp' ? np(0, kTw, { noRel: true }) : null;
        if (sTw && sTw.end === kTw) {
          pick(kTw + 2, aTw.e);
          const fTw = en.jp.adj(aTw.lemma === 'old' && sTw.an ? '年上の' : aTw.e.ja);
          const twTw = sTw.an || /^(?:boys|girls|brothers|sisters|men|women|students|players|people)$/.test((T[kTw + 6] || {}).w || '') ? '2人' : '2つ';
          name('comparative');
          return { ok: true, ja: sTw.ja + 'は' + twTw + 'のうちで' + (fTw.attr || fTw.raw) + 'ほう' + (/^(?:was|were)$/.test(T[kTw].w) ? 'だった' : 'だ') + '。', sp: 'SVC', names: NAMES.slice(), sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() };
        }
        fail(mTw);
      }
      if (kTw > 0 && isW(T[kTw + 1], 'more') && T[kTw + 2] && /^(?:a|an)$/.test(T[kTw + 2].w || '')) {
        const kTh2 = T.findIndex((x, q) => q > kTw + 3 && isW(x, 'than'));
        if (kTh2 > 0) {
          const mMa = mark();
          const sMa = np(0, kTw, { noRel: true });
          const n1Ma = sMa && sMa.end === kTw ? np(kTw + 2, kTh2, { noRel: true }) : null;
          const n2Ma = n1Ma && n1Ma.end === kTh2 ? np(kTh2 + 1, b, { noRel: true }) : null;
          if (n2Ma && n2Ma.end === b) { name('comparative'); return { ok: true, ja: sMa.ja + 'は' + n2Ma.ja + 'というよりむしろ' + n1Ma.ja + (/^(?:was|were)$/.test(T[kTw].w) ? 'だった' : 'だ') + '。', sp: 'SVC', names: NAMES.slice(), sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() }; }
          fail(mMa);
        }
      }
      reset(tokens);
    }
    // She went to the store only to find it closed.""")

rep("""    ja = ja.replace(/知識の隙間/g, '知識の空白')""",
    """    ja = ja.replace(/授業で(ずば抜けて)?(一番|最も)/g, 'クラスで$1$2');   // the best student in the class → クラスで一番いい生徒
    if (tokens.some((x) => /^(?:superior|inferior)$/.test(x.w || ''))) ja = ja.replace(/([^、。をがは]{1,8})に([^、。をがは]{1,8}より)(優れ|劣)/, '$1では$2$3');   // superior to me in math → 数学では私より優れている
    if (tokens.some((x, k) => x.w === 'than' && tokens[k + 1] && tokens[k + 1].w === 'ever')) ja = ja.replace(/今までより/, 'かつてないほど');   // higher than ever → かつてないほど高い
    ja = ja.replace(/知識の隙間/g, '知識の空白')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
