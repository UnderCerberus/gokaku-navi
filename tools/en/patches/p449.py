import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# My bag is the same as yours / The rules are almost the same as those of soccer → あなたのかばんと同じだ・サッカーのものとほぼ同じだ
rep("""    const exist = () => P(anim ? 'いる' : 'ある', anim ? 'v1' : 'aru');
""",
    """    const exist = () => P(anim ? 'いる' : 'ある', anim ? 'v1' : 'aru');
    if (vg.lemma === 'be' && !vg.passive) {
      let kSm = i, degSm = '';
      if (T[kSm] && T[kSm].k === 'w' && /^(?:almost|nearly|exactly|just|basically|essentially|not)$/.test(T[kSm].w) && T[kSm].w !== 'not') { degSm = { almost: 'ほぼ', nearly: 'ほぼ', exactly: 'まったく', just: 'ちょうど', basically: '基本的に', essentially: '本質的に' }[T[kSm].w]; kSm++; }
      if (seq(kSm, ['the', 'same', 'as']) && kSm + 3 < lim) {
        const mSm = mark();
        let nSm = null, endSm = -1;
        if (/^(?:those|that)$/.test(T[kSm + 3].w || '') && isW(T[kSm + 4], 'of')) { const nO = np(kSm + 5, lim, { noRel: true }); if (nO) { nSm = { ja: nO.ja + 'のもの' }; endSm = nO.end; } }
        else { const nX = np(kSm + 3, lim, { noRel: true }); if (nX) { nSm = nX; endSm = nX.end; } }
        if (nSm && endSm > 0) { name('idiom'); return fin(P(nSm.ja.replace(/のかばん$/, 'の') + 'と' + degSm + '同じだ', 'da'), tail(endSm, lim, st, o, vg), 'SVC', []); }
        fail(mSm);
      }
    }
""")

rep("""    ja = ja.replace(/人々でいっぱい/g, '人でいっぱい')""",
    """    ja = ja.replace(/見るのにわくわくする/g, '見ていてわくわくする');   // the games are exciting to watch → 見ていてわくわくする
    ja = ja.replace(/人々でいっぱい/g, '人でいっぱい')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
