import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# I finally agreed and decided to talk about my grandmother, who had moved to Japan … → 日本に移り住んだ祖母について話すことに決めた
# （コンマのあとの who / which で始まる部分は主節にしない。「話すために決められると、誰が…移り住んでいた」にしない）
rep("""      const pform = ingVerb(a, c0) ? 'ing' : (vc(t0, ['pp']) && !vc(t0, ['base', '3sg']) ? 'pp' : '');
      if (isInf || inOrder || pform) {""",
    """      const pform = ingVerb(a, c0) ? 'ing' : (vc(t0, ['pp']) && !vc(t0, ['base', '3sg']) ? 'pp' : '');
      if ((isInf || inOrder || pform) && !(T[c0 + 1] && T[c0 + 1].k === 'w' && /^(?:who|which|whose|whom)$/.test(T[c0 + 1].w) && !T.slice(c0 + 1, b + 1).some((x) => isP(x, '?')))) {""")

# practiced until I could say it → それを言えるようになるまで（推量の could を選ぶ「主張・予測の動詞（say …）」は could より前の語だけ見る。could の節の動詞 say 自身は数えない）
rep("""(o.sub && T.some((x) => x.k === 'w' && /^(?:warn|warns|fear|fears|say|says|think|thinks|believe|believes|argue|argues|predict|predicts|suggest|suggests|worry|worries|claim|claims|worried|concerned|afraid)$/.test(x.w))""",
    """(o.sub && T.some((x, q) => q < vg.idx && x.k === 'w' && /^(?:warn|warns|fear|fears|say|says|think|thinks|believe|believes|argue|argues|predict|predicts|suggest|suggests|worry|worries|claim|claims|worried|concerned|afraid)$/.test(x.w))""")

# For the next three weeks, I practiced my speech → その後の3週間（過去の文の the next + 期間は「その後の」。「今後3週間…練習した」にしない）
rep("""        const preFn2 = uFn ? ({ first: '最初の', last: '過去', next: '今後' })[T[i + 1].w] : preFn;""",
    """        const pastNx = T[i + 1].w === 'next' && !T.some((x) => x.k === 'w' && /^(?:will|shall|wo|going|tomorrow|is|are|am|has|have|do|does|can)$/.test(x.w)) && T.some((x, q) => x.k === 'w' && (/^(?:was|were|did|had)$/.test(x.w) || (!!vc(x, ['past']) && !vc(x, ['base', '3sg']) && !MODAL[x.w] && !(T[q - 1] && T[q - 1].k === 'w' && (!!BE[T[q - 1].w] || !!HAVE[T[q - 1].w])))));
        const preFn2 = uFn ? (pastNx ? 'その後の' : ({ first: '最初の', last: '過去', next: '今後' })[T[i + 1].w]) : preFn;""")

# for the next few days → 今後数日間 / over the last few years → 過去数年間（the + next / last / first / past + few + 期間の複数名詞。「次のものにとって日をほとんど」にしない）
rep("""    // the first three students / the last two days → 最初の3人の学生・最後の2日間
""",
    """    if (isW(t, 'the') && /^(?:first|last|next|past)$/.test((T[i + 1] || {}).w || '') && isW(T[i + 2], 'few') && i + 3 < lim && /^(?:days|weeks|months|years|hours|minutes|decades|centuries)$/.test(T[i + 3].w || '')) {
      const UFw = { days: '日間', weeks: '週間', months: 'か月間', years: '年間', hours: '時間', minutes: '分間', decades: '十年間', centuries: '世紀' }[T[i + 3].w];
      const pastFw = T[i + 1].w === 'next' && !T.some((x) => x.k === 'w' && /^(?:will|shall|wo|going|tomorrow|is|are|am|has|have|do|does|can)$/.test(x.w)) && T.some((x, q) => x.k === 'w' && (/^(?:was|were|did|had)$/.test(x.w) || (!!vc(x, ['past']) && !vc(x, ['base', '3sg']) && !MODAL[x.w] && !(T[q - 1] && T[q - 1].k === 'w' && (!!BE[T[q - 1].w] || !!HAVE[T[q - 1].w])))));
      const preFw = { first: '最初の', last: '過去', past: '過去', next: pastFw ? 'その後の' : '今後' }[T[i + 1].w];
      return postMod({ ja: preFw + '数' + UFw, end: i + 4, head: T[i + 3].w, pl: true, dur: true }, lim, o);
    }
    // the first three students / the last two days → 最初の3人の学生・最後の2日間
""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
