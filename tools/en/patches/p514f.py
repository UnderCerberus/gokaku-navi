import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# 1) feel happier and less stressed → より幸せで、あまりストレスを感じていない（形容詞の並列の後ろが less + 形容詞）
rep("""      if (k2 + 1 < lim && isW(T[k2], 'more') && adjC(T[k2 + 1])) { deg2 = 'より'; k2++; }""",
    """      if (k2 + 1 < lim && isW(T[k2], 'more') && adjC(T[k2 + 1])) { deg2 = 'より'; k2++; }
      else if (k2 + 1 < lim && isW(T[k2], 'less') && adjC(T[k2 + 1])) { deg2 = '\\u0001'; k2++; }   // less stressed → あまりストレスを感じていない（下で否定にする）""")

# 2) especially those who have just started working（特に + 関係詞つきの名詞句）
rep("""        const nEs = np(j + 2, lim, { noRel: true, noCoord: o.noCoord });""",
    """        let nEs = np(j + 2, lim, { noRel: true, noCoord: o.noCoord });
        if (nEs && nEs.end < lim && T[nEs.end].k === 'w' && /^(?:who|that|which)$/.test(T[nEs.end].w)) { const mEs2 = mark(); const nEs2 = np(j + 2, lim, { noCoord: o.noCoord }); if (nEs2 && nEs2.end > nEs.end) nEs = nEs2; else fail(mEs2); }""")

# 3) letters could take weeks to arrive → 手紙は届くのに何週間もかかる（人以外の主語 + take + 期間 + to do）
rep("""    if (L === 'feel' && i + 2 < lim && T[i].k === 'w' && adjC(T[i]) && T[i + 1].k === 'w' && !!vc(T[i + 1], ['ing'])""",
    """    if (L === 'take' && i + 2 < lim && o.subj && !(o.subj.pron === 'it')) {
      const mTk = mark();
      const dTk = np(i, lim, { noRel: true, noPost: true, noCoord: true });
      const durTk = dTk && (dTk.dur || (dTk.pl && !dTk.num && !dTk.det && dTk.head && DURUNIT[dTk.head.replace(/s$/, '')]));
      if (durTk && isW(T[dTk.end], 'to') && dTk.end + 1 < lim && T[dTk.end + 1].k === 'w' && !!vc(T[dTk.end + 1], ['base'])) {
        const iTk = vpNonfin(dTk.end + 1, lim, 'base', {});
        if (iTk && iTk.end === lim && verbal(iTk.pred)) {
          const hTk = dTk.head ? dTk.head.replace(/s$/, '') : '';
          const dJa = dTk.dur ? dTk.ja : '何' + (({ week: '週間', month: 'か月', year: '年', day: '日', hour: '時間', minute: '分', decade: '十年', century: '世紀' })[hTk] || '') + 'も';
          name('it-takes');
          return done(vg, P(vpJoin(iTk, 'dict').replace(/^到着する$/, '届く') + 'のに' + dJa + 'かかる', 'v5'), st, lim, 'SVO', o, [], { noStative: true });
        }
      }
      fail(mTk);
    }
    if (L === 'feel' && i + 2 < lim && T[i].k === 'w' && adjC(T[i]) && T[i + 1].k === 'w' && !!vc(T[i + 1], ['ing'])""")

# 4) come to Kyoto not only to see A but also to experience B → Aを見るためだけでなく、Bを体験するためにも
rep("""      if (isW(T[j0], 'not') && vg && T[j0 + 1] && T[j0 + 1].k === 'w' && PREP[T[j0 + 1].w] && j0 + 3 < lim) {""",
    """      if (seq(j0, ['not', 'only', 'to']) && vg && j0 + 4 < lim && T[j0 + 3].k === 'w' && !!vc(T[j0 + 3], ['base'])) {
        const mNt = mark();
        const kBt = T.findIndex((x, q) => q > j0 + 4 && q < lim - 2 && isW(x, 'but') && (seq(q + 1, ['also', 'to']) || isW(T[q + 1], 'to')));
        if (kBt > 0) {
          const eAt = isP(T[kBt - 1], ',') ? kBt - 1 : kBt;
          const k2t = isW(T[kBt + 1], 'also') ? kBt + 3 : kBt + 2;
          const v1t = vpNonfin(j0 + 3, eAt, 'base', {}), v2t = v1t && v1t.end === eAt ? vpNonfin(k2t, lim, 'base', {}) : null;
          if (v1t && v2t) { name('not-only'); st.other.push(vpJoin(v1t, 'dict') + 'ためだけでなく、' + vpJoin(v2t, 'dict') + 'ためにも'); j = v2t.end; continue; }
        }
        fail(mNt);
      }
      if (isW(T[j0], 'not') && vg && T[j0 + 1] && T[j0 + 1].k === 'w' && PREP[T[j0 + 1].w] && j0 + 3 < lim) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
