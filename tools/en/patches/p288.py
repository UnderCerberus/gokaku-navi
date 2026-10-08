import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# It's easy to use → それは使いやすい（to の後ろに目的語がない他動詞）
rep("""      if (isW(T[k2], 'to') && k2 + 1 < b && (a1.lemma === 'likely' || a1.lemma === 'unlikely') && !forNP && !ofNP) {""",
    """      if (isW(T[k2], 'to') && k2 + 2 === b && TOUGH[a1.lemma] && !forNP && !ofNP && vg.lemma === 'be' && !vg.neg && !vg.modal && o.subj && o.subj.pron === 'it') {   // It's easy to use → それは使いやすい / It is difficult to understand → それは理解しにくい
        const cTg2 = cand(T[k2 + 1], '動', ['base']);
        if (cTg2 && /^〜を/.test(cTg2.e.ja || '') && !/^(?:say|tell|imagine|believe|see|know|guess|predict|find|get|do|make|have|take)$/.test(cTg2.lemma)) {
          const coreTg2 = P(verbSense(cTg2.e, true).core);
          if (verbal(coreTg2) && !/[をにが]/.test(coreTg2.plain())) {
            pick(k, a1.e); pick(k2 + 1, cTg2.e); name('tough');
            const rTg2 = done(Object.assign({}, vg, { lemma: 'be' }), P('それは' + deg + coreTg2.form('stem') + TOUGH[a1.lemma], 'i'), st, b, 'SVC', o, [], { noStative: true });
            rTg2.noSubj = true;
            return mkClause(null, rTg2, '');
          }
        }
      }
      if (isW(T[k2], 'to') && k2 + 1 < b && (a1.lemma === 'likely' || a1.lemma === 'unlikely') && !forNP && !ofNP) {""")

# I couldn't be happier → 私はこれ以上ないほど幸せだ / The staff couldn't have been more helpful → スタッフはこれ以上ないほど親切だった
rep("""    // Hi, Ken. → こんにちは、ケン""",
    """    // I couldn't be happier → 私はこれ以上ないほど幸せだ / The staff couldn't have been more helpful → スタッフはこれ以上ないほど親切だった
    {
      const qCb = T.findIndex((x, q) => q > 0 && q < b && isW(x, 'could') && isW(T[q + 1], 'not'));
      if (qCb > 0 && qCb + 3 < b + 1) {
        let kCb = qCb + 2, pastCb = false;
        if (seq(kCb, ['have', 'been'])) { kCb += 2; pastCb = true; } else if (isW(T[kCb], 'be')) kCb += 1; else kCb = -1;
        let aCb = null;
        if (kCb > 0 && isW(T[kCb], 'more') && kCb + 2 === b && adjC(T[kCb + 1])) aCb = adjC(T[kCb + 1]);
        else if (kCb > 0 && kCb + 1 === b && adjC(T[kCb]) && adjC(T[kCb]).form === 'comp') aCb = adjC(T[kCb]);
        if (aCb && aCb.e) {
          const sCb = np(0, qCb, {});
          if (sCb && sCb.end === qCb) {
            const ADJCB = { helpful: '親切な', happy: '幸せな', good: 'よい', proud: '誇らしい', pleased: 'うれしい', glad: 'うれしい', excited: 'わくわくした', satisfied: '満足な', kind: '親切な', friendly: '親切な' };
            const fCb = en.jp.adj(ADJCB[aCb.lemma] || aCb.e.ja);
            const prCb = fCb.kind === 'ta' ? (pastCb ? fCb.raw.replace(/た$/, 'していた').replace(/しし/, 'し') : fCb.pred.s) : (pastCb ? fCb.pred.form('past') : fCb.pred.s);
            return { ok: true, ja: sCb.ja + 'は' + 'これ以上ないほど' + prCb + '。', sp: '', names: ['comparative', 'fixed'], sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() };
          }
          reset(tokens);
        }
      }
    }
    // Hi, Ken. → こんにちは、ケン""")

# , though（文末）→ ただ、
rep("""(T[b - 1].w === 'then' ? 'では' : 'もっとも')) + '、';""", """(T[b - 1].w === 'then' ? 'では' : 'ただ')) + '、';""")

# 電池が長くもたない / 星5つをつける / 量は多かった / 意外だった / がっかりした / ショックを受けた / 必ずまた
rep("""ja = ja.replace(/続(く|いた)/g, (m0, a0) => (a0 === 'く' ? 'もつ' : 'もった'));""",
    """ja = ja.replace(/続(く|いた)/g, (m0, a0) => (a0 === 'く' ? 'もつ' : 'もった')).replace(/長い間続か(ない|なかった)/g, (m0, a0) => (tokens.some((x) => x.w === 'very') ? 'あまり' : '') + '長くもた' + a0).replace(/続か(ない|なかった)/g, 'もた$1');""")

rep("""    ja = ja.replace(/ということは哀れみだ/g, 'のは残念だ')""",
    """    ja = ja.replace(/それに([0-9０-９]+)つの星を与え(る|た)/, '星$1つをつけ$2');   // I give it five stars → 星5つをつける
    if (tokens.some((x) => /^(?:portions|portion)$/.test(x.w || ''))) ja = ja.replace(/^(?:その)?一部は(?:巨大|とても大き|大き|多)(?:だった|かった)/, '量はとても多かった').replace(/^(?:その)?一部は(?:巨大|とても大き|大き|多)(?:だ|い)(?=。|$)/, '量はとても多い').replace(/^(?:その)?一部は小さかった/, '量は少なかった').replace(/^(?:その)?一部は小さい/, '量は少ない');   // The portions were huge → 量はとても多かった
    ja = ja.replace(/^([^、。]{1,10}?)は驚くべき(だった|だ)(?=。|$)/, '$1は意外$2');   // The ending was surprising → 結末は意外だった
    if (tokens.some((x) => x.w === 'disappointed') && tokens.some((x) => /^(?:was|were)$/.test(x.w || '')) && !tokens.some((x) => /^(?:had|always|still|often|never)$/.test(x.w || ''))) ja = ja.replace(/失望していた/g, 'がっかりした');   // I was disappointed with the quality → 質にがっかりした
    ja = ja.replace(/に衝撃を与えられた/g, 'にショックを受けた').replace(/に衝撃を与えられる/g, 'にショックを受ける');   // I was shocked by the news → ニュースにショックを受けた
    if (tokens.some((x) => x.w === 'definitely') && tokens.some((x) => x.w === 'will')) ja = ja.replace(/また確かに/g, '必ずまた').replace(/確かに(?=[^、。]{0,12}(?:つもりだ|だろう))/, '必ず');   // I'll definitely come back again → 必ずまた戻るつもりだ
    ja = ja.replace(/ということは哀れみだ/g, 'のは残念だ')""")

rep("""'wet paint': 'ペンキ塗りたて', """,
    """'wet paint': 'ペンキ塗りたて', 'it was worth every penny': '払ったお金に見合う価値が十分にあった', 'it is worth every penny': '払うお金に見合う価値が十分にある', 'worth every penny': 'お金を払う価値が十分にある', 'it is good value for money': '値段の割にお得だ', 'it is great value for money': '値段の割にとてもお得だ', 'it was good value for money': '値段の割にお得だった', 'good value for money': '値段の割にお得', 'highly recommended': 'とてもおすすめです', 'recommended': 'おすすめです', 'it is a must-see': 'それは必見だ', 'it is a must-read': 'それは必読だ', 'a must-see': '必見', """)

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
