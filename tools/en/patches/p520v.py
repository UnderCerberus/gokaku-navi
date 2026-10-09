import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# She was told that she had passed → 彼女は合格したと言われた（受け身 + that 節。that を代名詞 + 関係詞節にしない）
# He was told the news → 彼はその知らせを知らされた（受け身の tell + 情報の名詞）
rep("""  function vpGeneric(vg, i, lim, st, o) {
""",
    """  function vpGeneric(vg, i, lim, st, o) {
    // had been told in advance what the researchers expected to find → 前もって…かを知らされていた（受け身 + 副詞句 + 疑問詞節）
    if (vg.passive && /^(?:tell|inform|teach|show|remind)$/.test(vg.lemma) && !st.agent && i + 3 < lim && !(T[i].k === 'w' && /^(?:that|what|how|where|when|why|who|which|whether|to)$/.test(T[i].w))) {
      const kWp = T.findIndex((x, q) => q > i && q < Math.min(lim - 2, i + 4) && x.k === 'w' && /^(?:what|how|where|when|why|who|which|whether)$/.test(x.w));
      if (kWp > 0) {
        const mWp = mark();
        const nM = st.manner.length, nO = st.other.length, nTm = st.time.length;
        const eWp = tail(i, kWp, st, o, vg);
        const wcP = eWp === kWp ? whClause(kWp, lim) : null;
        if (wcP && wcP.end === lim) { name('passive'); return done(Object.assign({}, vg, { passive: false }), P(vg.lemma === 'teach' || vg.lemma === 'show' ? '教えられる' : '知らされる', 'v1'), st, lim, 'SVO', o, [wcP.str + 'を']); }
        st.manner.length = nM; st.other.length = nO; st.time.length = nTm;
        fail(mWp);
      }
    }
    if (vg.passive && /^(?:tell|inform|warn|teach|remind|assure|advise|promise|notify)$/.test(vg.lemma) && isW(T[i], 'that') && i + 2 < lim && !st.agent) {
      const mPt = mark();
      const tcP = thatClause(i, lim, vg.past || vg.perfect);
      if (tcP && tcP.str) {
        const PJP = { i: '私', we: '私たち', you: 'あなた', he: '彼', she: '彼女', they: '彼ら' };
        let sP = tcP.str;
        if (o.subj && o.subj.pron && PJP[o.subj.pron] && tcP.cl && tcP.cl.subj && tcP.cl.subj.pron === o.subj.pron && sP.indexOf(PJP[o.subj.pron] + 'が') === 0) sP = sP.slice(PJP[o.subj.pron].length + 1);   // 彼女は（彼女が）合格したと言われた
        if (vg.past && tcP.cl && tcP.cl.modal === 'would' && !tcP.cl.perfect) sP = sP.replace(/だろう$/, '');   // We were told the train would be late → 遅れると言われた
        const PVJ = { tell: '言われる', inform: '知らされる', warn: '警告される', teach: '教えられる', remind: '念を押される', assure: '保証される', advise: '助言される', promise: '約束される', notify: '知らされる' };
        name('that-clause'); name('passive');
        return done(Object.assign({}, vg, { passive: false }), P(PVJ[vg.lemma], 'v1'), st, tcP.end, 'SVO', o, [sP + 'と']);
      }
      fail(mPt);
    }
    if (vg.passive && vg.lemma === 'tell' && !st.agent && T[i] && T[i].k === 'w' && (DET[T[i].w] !== undefined || !!nounC(T[i])) && !PRON[T[i].w]) {
      const mPn = mark();
      const nPn = np(i, lim, { noRel: false });
      if (nPn && !nPn.an && /(?:^| )(?:news|result|results|truth|fact|facts|decision|answer|answers|details|plan|plans|reason|price|date|time|score|scores)$/.test(nPn.head || '')) {
        name('passive');
        return done(Object.assign({}, vg, { passive: false }), P('知らされる', 'v1'), st, tail(nPn.end, lim, st, o, vg), 'SVO', o, [nPn.ja + 'を']);
      }
      if (nPn && !nPn.an && /(?:^| )(?:story|stories|joke|jokes|tale|tales|lie|lies|secret|secrets)$/.test(nPn.head || '')) {
        name('passive');
        return done(Object.assign({}, vg, { passive: false }), P('聞かされる', 'v1'), st, tail(nPn.end, lim, st, o, vg), 'SVO', o, [nPn.ja + 'を']);
      }
      fail(mPn);
    }
""")
# expected to find → 見つけると予想した（意図でない動詞の expect to は 予想する）
rep("""remember: (p, st) => { st.manner.push('忘れずに'); return p; }, expect: sfx('つもりである', 'aru'),""",
    """remember: (p, st) => { st.manner.push('忘れずに'); return p; }, expect: (p) => (/^(?:見つける|発見する|見る|見つかる|勝つ|負ける|受け取る|もらう|得る|聞く|増える|減る|上がる|下がる|起こる|成功する|失敗する|変わる|続く|終わる|到着する|着く)$/.test(p.plain()) ? P(p.plain() + 'と予想する', 'suru') : P(p.plain() + 'つもりである', 'aru')),   // researchers expected to find → 見つけると予想した""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
