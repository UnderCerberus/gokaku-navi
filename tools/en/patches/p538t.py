import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# it rained the whole weekend → 週末ずっと雨が降った / It rained all weekend → 週末ずっと（「週末全体を」「毎週末に」にしない）/ I slept the whole day → 一日中眠った
rep("""    'all week': '1週間ずっと', 'all year': '1年中', 'all summer': '夏の間ずっと', 'all winter': '冬の間ずっと',""",
    """    'all week': '1週間ずっと', 'all year': '1年中', 'all summer': '夏の間ずっと', 'all winter': '冬の間ずっと', 'all weekend': '週末ずっと', 'the whole weekend': '週末ずっと',
    'the whole day': '一日中', 'the whole night': '一晩中', 'the whole morning': '午前中ずっと', 'the whole afternoon': '午後ずっと', 'the whole week': '1週間ずっと', 'the whole summer': '夏の間ずっと',
    'the whole winter': '冬の間ずっと', 'the whole year': '1年中', 'the whole time': 'その間ずっと', 'the entire weekend': '週末ずっと', 'the entire day': '一日中', 'the entire night': '一晩中',""")
# 目的語の位置の時の句（the whole day / all weekend）は、過ごす・楽しむ などでなければ目的語にしない
rep("""        if (n && TIMEPH[T.slice(j, n.end).map((x) => x.w).join(' ')] && /^(?:last|next|this|every)$/.test(T[j].w) && !(vg.lemma === 'spend' || vg.lemma === 'enjoy' || vg.lemma === 'remember' || vg.lemma === 'forget')) { fail(m1); break; }""",
    """        if (n && TIMEPH[T.slice(j, n.end).map((x) => x.w).join(' ')] && (/^(?:last|next|this|every|all)$/.test(T[j].w) || seq(j, ['the', 'whole']) || seq(j, ['the', 'entire'])) && !(vg.lemma === 'spend' || vg.lemma === 'enjoy' || vg.lemma === 'remember' || vg.lemma === 'forget' || vg.lemma === 'waste' || vg.lemma === 'take' || vg.lemma === 'need' || vg.lemma === 'have' || vg.lemma === 'ruin' || vg.lemma === 'make' || vg.lemma === 'save')) { fail(m1); break; }""")

# np の時の句（the whole day / all weekend）に主要語を残す（spent the whole day → 一日中過ごした: 「費やした」にしない）
rep("""          return { ja: TIMEPH[key].replace(/に$/, ''), end: i + len, time: true, det: t.w };""",
    """          return { ja: TIMEPH[key].replace(/に$/, ''), end: i + len, time: true, det: t.w, head: /^(?:the (?:whole|entire)|all) /.test(key) ? T[i + len - 1].w : undefined };""")

# spent the whole day at the beach → 浜辺で一日中過ごした（過ごす・楽しむ などの目的語の the whole + 時の名詞は、決まり文句の副詞として先に取らない）
rep("""      let k = modFixed(j0, lim, st);
      if (k > 0) { j = k; continue; }
      const t = T[j0];""",
    """      const keepObjT = objs.length === 0 && j0 === j && /^(?:spend|enjoy|remember|forget|waste|ruin|save)$/.test(vg.lemma) && !vg.passive && (seq(j0, ['the', 'whole']) || seq(j0, ['the', 'entire']));
      let k = keepObjT ? -1 : modFixed(j0, lim, st);
      if (k > 0) { j = k; continue; }
      const t = T[j0];""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
