import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# 1) Nothing is more important than spending time with your family（than の後の -ing は動名詞句として先に読む）
rep("""            let n = np(e + 1, lim, { noRel: true, pp: seq(e + 1, ['any', 'other']) || seq(e + 1, ['all', 'the', 'other']) || seq(e + 1, ['the', 'other']) || seq(e + 1, ['anyone', 'else']) });   // than any other boy in his class（前置詞句は少年につける）""",
    """            const gTh = ingVerb(e + 1, lim) ? gerundNP(e + 1, lim) : null;   // than spending time with your family → 家族と一緒に時間を過ごすこと
            let n = gTh && gTh.end === lim ? gTh : np(e + 1, lim, { noRel: true, pp: seq(e + 1, ['any', 'other']) || seq(e + 1, ['all', 'the', 'other']) || seq(e + 1, ['the', 'other']) || seq(e + 1, ['anyone', 'else']) });   // than any other boy in his class（前置詞句は少年につける）""")

# 2) wait for a long time: for + 期間（数がなくても a long time / a while など）は熟語の目的語にしない
rep("""          if (it.lit[it.lit.length - 1] === 'for' && obj.dur && obj.num && !obj.det) { fail(m); continue; }""",
    """          if (it.lit[it.lit.length - 1] === 'for' && obj.dur && ((obj.num && !obj.det) || /^(?:a long time|a while|a short time|a moment|some time|ages|hours|days|weeks|months|years|a little while|a few minutes|a few hours|a few days)$/.test(T.slice(s0, obj.end).map((x) => x.w).join(' ')))) { fail(m); continue; }""")

# 3) depends not so much on talent as on hard work → 才能というよりむしろ努力次第だ（前置詞つき熟語の not so much A as B）
rep("""      } else if (it.shape === 'obj') {
        if (!n || i + n > lim || !seq(i, it.lit)) continue;
        const s0 = i + n;
        if (it.lit[n - 1] === 'at' && T[s0] && /^(?:least|first|last|once|all|most|times)$/.test(T[s0].w || '')) continue;   // arrive at least 15 minutes before … の at は熟語の前置詞ではない
        let obj = null;""",
    """      } else if (it.shape === 'obj') {
        const nsm = n > 0 && seq(i, ['not', 'so', 'much']) && seq(i + 3, it.lit);
        if (!n || i + n > lim || !(seq(i, it.lit) || nsm)) continue;
        const s0 = nsm ? i + 3 + n : i + n;
        if (it.lit[n - 1] === 'at' && T[s0] && /^(?:least|first|last|once|all|most|times)$/.test(T[s0].w || '')) continue;   // arrive at least 15 minutes before … の at は熟語の前置詞ではない
        let obj = null;
        if (nsm) {
          const xN = gerundNP(s0, lim) || np(s0, lim, { noRel: true, noCoord: true });
          const yN = xN && isW(T[xN.end], 'as') && seq(xN.end + 1, it.lit) ? (gerundNP(xN.end + 1 + n, lim) || np(xN.end + 1 + n, lim, {})) : null;
          if (!yN) { fail(m); continue; }
          name('not-so-much');
          obj = { ja: xN.ja + 'というよりむしろ' + yN.ja, end: yN.end };
        }""")
rep("""        if (s0 >= lim || gapTail) {
          if (!(o.gap && o.gap.type === 'np' && !o.gap.used)) { fail(m); continue; }""",
    """        if (obj) { /* not so much A as B */ } else if (s0 >= lim || gapTail) {
          if (!(o.gap && o.gap.type === 'np' && !o.gap.used)) { fail(m); continue; }""")

# 4) can join regardless of age or experience: 前置詞 + 名詞 + or + 名詞 1 語で終わるなら、名詞の並列（動詞の並列にしない）
rep("""      else if (T[x].k === 'w' && /^(?:and|or)$/.test(T[x].w) && vb(x + 1)) {
        if (!cuts.length""",
    """      else if (T[x].k === 'w' && /^(?:and|or)$/.test(T[x].w) && vb(x + 1)) {
        if (x - 2 > v0 && T[x - 2].k === 'w' && PREP[T[x - 2].w] && !!nounC(T[x - 1]) && !!nounC(T[x + 1]) && (x + 2 >= b || T[x + 2].k === 'p')) return null;   // regardless of age or experience
        if (!cuts.length""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
