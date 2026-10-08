import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# shift → シフト は勤務の文だけ（this shift will free people to focus on creative work は「変化」）
rep("""    if (tokens.some((x) => /^(?:shift|shifts)$/.test(x.w || '')) && tokens.some((x) => /^(?:my|your|his|her|our|their|night|morning|early|late|work|works|working|job|cover|starts|start|ends|end|finish|finishes|swap|change)$/.test(x.w || ''))) ja = ja""",
    """    if (tokens.some((x, k) => /^(?:shift|shifts)$/.test(x.w || '') && ((tokens[k - 1] && /^(?:my|your|his|her|our|their|night|morning|early|late|work|day|evening|double|next|first|second|third|afternoon|weekend|working)$/.test(tokens[k - 1].w || '')) || (tokens[k + 1] && /^(?:starts|start|ends|end|work|worker|workers|schedule|schedules|begins|finishes|finish)$/.test(tokens[k + 1].w || '')))) || (tokens.some((x) => /^(?:shift|shifts)$/.test(x.w || '')) && tokens.some((x) => /^(?:cover|swap)$/.test(x.w || '')))) ja = ja""")

# address + 懸念・問題 → 対処する / express concerns → 懸念を表明する / transform + 抽象名詞 → 大きく変える
rep("""      else if (L === 'display' && /(?:^| )(?:color|colors""",
    """      else if (L === 'address' && /(?:^| )(?:concern|concerns|problem|problems|issue|issues|challenge|challenges|need|needs|question|questions|complaint|complaints|risk|risks|shortage|shortages|crisis|threat|threats|inequality|poverty|gap|gaps)$/.test(oh)) sense = { particle: 'に', core: '対処する', tr: true };   // To address these concerns → これらの懸念に対処するために
      else if (L === 'express' && /(?:^| )(?:concern|concerns|worry|worries|doubt|doubts|opposition|support|regret|hope|interest|disappointment|frustration|anger|sympathy|gratitude|thanks|appreciation)$/.test(oh)) sense = { particle: 'を', core: '表明する', tr: true };   // expressed concerns about safety → 安全性について懸念を表明した
      else if (L === 'transform' && /(?:^| )(?:way|ways|life|lives|society|societies|industry|industries|economy|economies|world|city|cities|education|business|businesses|field|landscape|country|community|communities|culture|workplace|healthcare|medicine)$/.test(oh)) sense = { particle: 'を', core: '大きく変える', tr: true };   // AI is transforming our society → 社会を大きく変えつつある
      else if (L === 'display' && /(?:^| )(?:color|colors""")

# free people to focus on … → 人々が…に集中できるようにする
rep("""    // She went to the store only to find it closed.""",
    """    // This shift will free people to focus on creative work. → この変化は人々が創造的な仕事に集中できるようにするだろう（free O to do）
    if (b > 5) {
      const kFr = T.findIndex((x, q) => q >= 1 && /^(?:free|frees|freed)$/.test(x.w || '') && q + 3 < b);
      if (kFr > 0) {
        const kMd = T[kFr - 1].k === 'w' && MODAL[T[kFr - 1].w] ? kFr - 1 : kFr;
        const mFr = mark();
        const sFr = kMd >= 1 ? np(0, kMd, { noRel: true }) : null;
        const oFr = sFr && sFr.end === kMd ? np(kFr + 1, b, { noRel: true }) : null;
        if (oFr && oFr.end < b && isW(T[oFr.end], 'to') && vc(T[oFr.end + 1], ['base']) && (oFr.an || /^(?:them|us|me|him|her|you)$/.test(oFr.pron || '') || /^(?:people|workers|employees|teachers|doctors|nurses|staff|humans|students|parents|women|men|farmers|scientists)$/.test(oFr.head || ''))) {
          const vFr = vpNonfin(oFr.end + 1, b, 'base', {});
          if (vFr && vFr.end === b && verbal(vFr.pred) && !vFr.neg) {
            const mdFr = kMd < kFr ? T[kMd].w : '';
            const tailFr = mdFr ? (({ will: 'ようにするだろう', would: 'ようにするだろう', could: 'ようにできるかもしれない', may: 'ようにするかもしれない', might: 'ようにするかもしれない', can: 'ようにできる', should: 'ようにするべきだ' })[mdFr] || 'ようにする') : (T[kFr].w === 'freed' ? 'ようにした' : 'ようにする');
            name('v-o-to');
            return { ok: true, ja: sFr.ja + 'は' + oFr.ja + 'が' + vFr.parts.join('') + vFr.pred.aux('can').plain() + tailFr + '。', sp: 'SVOC', names: NAMES.slice(), sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() };
          }
        }
        fail(mFr);
      }
    }
    // She went to the store only to find it closed.""")

rep("""    ja = ja.replace(/一方で、また/g, '一方で、');""",
    """    ja = ja.replace(/一方で、また/g, '一方で、');
    ja = ja.replace(/働き方や生き方/g, '働き方や暮らし方').replace(/(機械|ロボット|コンピューター|コンピュータ|AI|人工知能)が今では/g, '今では$1が');   // the way we work and live → 働き方や暮らし方 / can now be performed by machines → 今では機械が行える""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
