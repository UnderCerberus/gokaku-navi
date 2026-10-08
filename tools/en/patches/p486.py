import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# I will see to it that the work is done. → 私は必ず仕事が終わるようにする
rep("""    // She went to the store only to find it closed.""",
    """    if (b > 6 && !tokens.__seeTo) {
      const kSt = T.findIndex((x, q) => q >= 1 && /^(?:see|sees|saw|seen|seeing)$/.test(x.w || '') && seq(q + 1, ['to', 'it', 'that']));
      if (kSt > 0) {
        const mSt = mark();
        let kSj = kSt;
        while (kSj > 0 && T[kSj - 1].k === 'w' && (MODAL[T[kSj - 1].w] || /^(?:will|shall|must|should|always|personally)$/.test(T[kSj - 1].w))) kSj--;
        const sSt = kSj > 0 ? np(0, kSj, { noRel: true }) : null;
        if (sSt && sSt.end === kSj) {
          const tcSt = thatClause(kSt + 3, b, /^(?:saw)$/.test(T[kSt].w));
          if (tcSt) {
            name('that-clause'); name('idiom');
            const bodySt = tcSt.str.replace(/(?:だろう|つもりだ)$/, '').replace(/された$/, 'される').replace(/(終わっ|片付い|済ん)た$/, (m0, a0) => ({ '終わっ': '終わる', '片付い': '片付く', '済ん': '済む' })[a0]).replace(/た$/, 'る');
            return { ok: true, ja: sSt.ja + 'は必ず' + bodySt + 'ようにする。', sp: 'SVO', names: NAMES.slice(), sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() };
          }
        }
        fail(mSt);
        reset(tokens);
      }
    }
    // She went to the store only to find it closed.""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
