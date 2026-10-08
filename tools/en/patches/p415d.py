import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""    // Dear Mr. Brown, I am writing to ask … → ブラウン様。…についてお尋ねしたく、ご連絡しました（書き出しの呼びかけ + 本文）
""",
    """    // 呼びかけ: Ken, come here. / Mom, I'm hungry. → ケン、ここに来なさい / I'm hungry, Mom. → お母さん、おなかがすいた / Thank you, Mr. Smith. → ありがとうございます、スミスさん
    if (b > 2 && !tokens.__voc) {
      const VOC_JA = { mom: 'お母さん', mother: 'お母さん', mommy: 'ママ', mum: 'お母さん', mummy: 'ママ', dad: 'お父さん', father: 'お父さん', daddy: 'パパ', grandma: 'おばあちゃん', grandmother: 'おばあちゃん', granny: 'おばあちゃん', grandpa: 'おじいちゃん', grandfather: 'おじいちゃん', kids: 'みんな', children: 'みんな', boys: 'みんな', girls: 'みんな', everyone: 'みなさん', everybody: 'みなさん', guys: 'みんな', class: 'みなさん', students: 'みなさん', teacher: '先生', doctor: '先生', officer: 'おまわりさん', honey: 'ねえ', sweetie: 'ねえ', dear: 'ねえ', buddy: 'ねえ', team: 'みんな', friends: 'みなさん', sis: 'お姉ちゃん', son: 'ねえ' };
      const vocAt = (a1, b1) => {   // T[a1, b1) が呼びかけの名詞句なら訳を返す
        if (b1 - a1 === 1 && T[a1].k === 'w' && VOC_JA[T[a1].w]) return VOC_JA[T[a1].w];
        if (b1 - a1 > 3) return null;
        if (!T.slice(a1, b1).every((x) => (x.k === 'w' && x.cap) || isP(x, '.'))) return null;
        const nV = np(a1, b1, { noRel: true });
        if (!nV || nV.end !== b1 || !(nV.proper || /^(?:mr|ms|mrs|miss|dr|professor)$/.test(T[a1].w || '')) || /^(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday|january|february|march|april|may|june|july|august|september|october|november|december|today|yesterday|tomorrow)$/.test(T[a1].w || '')) return null;
        if (PN[T[a1].w] && !/[ァ-ヶー]$/.test(nV.ja)) return null;   // 地名（東京・京都）は呼びかけにしない
        return nV.ja;
      };
      const STARTV = /^(?:please|let|do|does|did|is|are|was|were|have|has|come|go|look|be|stop|wait|hurry|listen|sit|stand|take|give|get|thank|thanks|what|where|when|why|how|who|which|it|this|that|there|here|i|you|we|they|he|she|yes|no|can|could|will|would|shall|should|may|might|must|watch|help|tell|try|don|open|close|turn|put|bring|eat|have|keep|remember|good|happy|welcome|see|are|am|excuse|sorry|hurry|wake|hold|clean|finish|show|guess|check|calm|enjoy|say)$/;
      // 文頭の呼びかけ
      const cV = T.findIndex((x, q) => q >= 1 && q <= 3 && isP(x, ','));
      if (cV > 0 && cV + 1 < b && T[cV + 1].k === 'w' && STARTV.test(T[cV + 1].w) && !(T[cV + 1].cap && T[cV + 1].w !== 'i' && T[cV + 1].i !== 0 && !STARTV.test(T[cV + 1].w))) {
        const vJ = vocAt(0, cV);
        reset(tokens);
        if (vJ) {
          const tV = tokens.slice(cV + 1).map((x, k) => Object.assign({}, x, { i: k, first: k === 0, cap: k === 0 ? false : x.cap }));
          tV.__voc = true;
          const rV = translate1(tV);
          reset(tokens);
          if (rV && rV.ok && !(rV.names || []).includes('fragment')) return Object.assign({}, rV, { ja: vJ + '、' + rV.ja });
        }
      }
      // 文末の呼びかけ
      const cT = (() => { for (let q = b - 2; q >= Math.max(1, b - 5); q--) if (isP(T[q], ',')) return q; return -1; })();
      if (cT > 0 && cT + 1 < b) {
        const vJ2 = vocAt(cT + 1, b);
        reset(tokens);
        const leftW = T.slice(0, cT).filter((x) => x.k === 'w').map((x) => x.w);
        const imper = !!(T[0].k === 'w' && (vc(T[0], ['base']) && !nounC(T[0]) || /^(?:please|let|don|do)$/.test(T[0].w)));
        const intj = leftW.length <= 3 && /^(?:yes|no|okay|ok|sure|thanks|thank|hello|hi|bye|goodbye|sorry|good|congratulations|welcome|right|alright|all)$/.test(leftW[0] || '');
        const isName = vJ2 && !VOC_JA[T[cT + 1].w];
        if (vJ2 && (!isName || imper || intj || q || leftW.includes('you'))) {
          const tL = tokens.slice(0, cT).concat([Object.assign({}, tokens[b] || { k: 'p', w: '.', s: '.' })]).map((x, k) => Object.assign({}, x, { i: k }));
          tL.__voc = true;
          const rL = translate1(tL);
          reset(tokens);
          if (rL && rL.ok && !(rL.names || []).includes('fragment')) {
            const lj = rL.ja.replace(/。$/, '');
            return Object.assign({}, rL, { ja: intj ? lj + '、' + vJ2 + (/[？?か]$/.test(lj) ? '' : '') + '。' : vJ2 + '、' + rL.ja });
          }
        }
      }
    }
    // Dear Mr. Brown, I am writing to ask … → ブラウン様。…についてお尋ねしたく、ご連絡しました（書き出しの呼びかけ + 本文）
""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
