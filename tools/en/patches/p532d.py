import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# I made fifty of them / I ate three of them / three of us → それらのうち50個・それらのうち3つ・私たちのうち3人（数 + of + 代名詞）
rep("""        if (!num.pct && !num.ord && !det && Number.isInteger(num.val) && num.val >= 2 && num.val <= 20 && isW(T[num.end], 'of') && num.end + 1 < lim && T[num.end + 1].k === 'w' && /^(?:the|his|her|my|your|our|their|these|those)$/.test(T[num.end + 1].w)) {   // two of his books""",
    """        if (!num.pct && !num.ord && !det && Number.isInteger(num.val) && num.val >= 2 && isW(T[num.end], 'of') && num.end + 1 < lim && T[num.end + 1].k === 'w' && /^(?:them|us)$/.test(T[num.end + 1].w) && (num.end + 2 >= lim || T[num.end + 2].k !== 'w' || !nounC(T[num.end + 2]) || !!PREP[T[num.end + 2].w])) {
          const ofI = num.end + 1;
          const hasPlOf = T.slice(0, i).some((x) => x.k === 'w' && !PRON[x.w] && !!cand(x, '名', ['pl']) && !vc(x, ['3sg']));
          let antOf = T[ofI].w === 'us' ? 'an' : (hasPlOf ? pluralAntecedent(ofI) : null);
          if (!antOf) {
            let kv = i - 1;
            while (kv >= 0 && T[kv].k === 'w' && /^(?:than|more|less|about|over|nearly|almost|around|at|least|only|just)$/.test(T[kv].w)) kv--;
            const cvOf = kv >= 0 && T[kv].k === 'w' ? vc(T[kv], ['base', 'past', 'pp', '3sg']) : null;
            let kA = ofI + 1;
            while (T[kA] && T[kA].k === 'w' && (BE[T[kA].w] || HAVE[T[kA].w] || MODAL[T[kA].w] || /^(?:been|also|still|already|not)$/.test(T[kA].w))) kA++;
            const ppA = kA > ofI + 1 && T[kA] && T[kA].k === 'w' ? vc(T[kA], ['pp']) : null;
            if ((cvOf && /^(?:make|eat|buy|sell|cook|bake|drink|use|keep|take|bring|carry|find|lose|break|throw|collect|read|write|plant|pick|order|wash|need|want|have)$/.test(cvOf.lemma)) ||
              (ppA && /^(?:break|damage|make|sell|eat|lose|steal|find|build|destroy|buy|use|throw|repair|fix|paint|print|cook|produce|ship|deliver|recycle)$/.test(ppA.lemma))) antOf = 'inan';
            else antOf = 'an';
          }
          const anOf = antOf === 'an';
          return { ja: (T[ofI].w === 'us' ? '私たち' : (anOf ? '彼ら' : 'それら')) + 'のうち' + num.ja + (anOf ? '人' : (num.val <= 9 ? 'つ' : '個')), end: ofI + 1, num: num, pl: true, an: anOf, head: anOf ? 'person' : 'one' };
        }
        if (!num.pct && !num.ord && !det && Number.isInteger(num.val) && num.val >= 2 && num.val <= 20 && isW(T[num.end], 'of') && num.end + 1 < lim && T[num.end + 1].k === 'w' && /^(?:the|his|her|my|your|our|their|these|those)$/.test(T[num.end + 1].w)) {   // two of his books""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
