import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# steps that seem easier to start → より始めやすく思える（seem / look + easy / hard + to 不定詞（目的語の欠けた tough 構文）。「始まるためにより簡単に」にしない）
rep("""      const goUn = L === 'go' && !!ap && /^un/.test(ap.lemma);   // went unanswered / go unnoticed（un- の形容詞 → 〜のままだ）""",
    """      const goUn = L === 'go' && !!ap && /^un/.test(ap.lemma);   // went unanswered / go unnoticed（un- の形容詞 → 〜のままだ）
      if (ap && TOUGH[ap.lemma] && isW(T[ap.end], 'to') && ap.end + 1 < lim && !!vc(T[ap.end + 1], ['base']) && /^(?:seem|appear|look|sound|become|get|grow)$/.test(L)) {
        const mTg = mark();
        const gTg = { type: 'np', rel: true, used: false };
        const iTg = vpNonfin(ap.end + 1, lim, 'base', { gap: gTg });
        if (iTg && verbal(iTg.pred) && gTg.used) {
          const eTg = tail(iTg.end, lim, st, o, vg);
          if (eTg === lim) {
            pick(ap.idx, ap.e);
            name('tough');
            const vTg = ({ seem: '思える', appear: '思える', look: '見える', sound: '聞こえる', become: 'なる', get: 'なる', grow: 'なる' })[L];
            return done(vg, P((ap.deg || (ap.form === 'comp' ? 'より' : '')) + iTg.pred.form('stem') + TOUGH[ap.lemma].replace(/い$/, 'く') + vTg, /なる$/.test(vTg) ? 'v5' : 'v1'), st, eTg, 'SVC', o, iTg.parts, { noStative: true });
          }
        }
        fail(mTg);
      }""")

# break a large task into smaller steps / broke the class into three groups → 分ける（break + into + 部分・集団。壊す にしない）
rep("""      else if (L === 'break' && !vg.passive && /^(?:leg|legs|arm|arms|bone|bones|wrist|wrists|ankle|ankles|finger|fingers|nose|rib|ribs|neck|toe|toes|hip|collarbone)$/.test(oh)) sense = { particle: 'を', core: '骨折する', tr: true };""",
    """      else if (L === 'break' && !vg.passive && /^(?:leg|legs|arm|arms|bone|bones|wrist|wrists|ankle|ankles|finger|fingers|nose|rib|ribs|neck|toe|toes|hip|collarbone)$/.test(oh)) sense = { particle: 'を', core: '骨折する', tr: true };
      else if (L === 'break' && !vg.passive && T.slice(objs[0].end, lim).some((x, q) => isW(x, 'into') && T.slice(objs[0].end + q + 1, Math.min(lim, objs[0].end + q + 5)).some((y) => y.k === 'w' && /^(?:steps|groups|parts|sections|teams|categories|chunks|tasks|units|stages|pieces|smaller|pairs|segments|sentences|words|syllables)$/.test(y.w)))) sense = { particle: 'を', core: '分ける', tr: true };   // break a large task into smaller steps → 小さな段階に分ける""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
