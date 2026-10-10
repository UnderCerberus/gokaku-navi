import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# It only takes a single message from a friend to break a student's concentration → 生徒の集中を途切れさせるには友達からのたった1つの伝言だけで十分だ / It only takes a minute → 1分しかかからない（it + only + take。時間でない名詞句は「〜が必要だ」）
rep("""    const advIt = T[a + 1] && T[a + 1].k === 'w' && /^(?:never|suddenly|finally|then|soon|gradually|slowly|only|first)$/.test(T[a + 1].w) && T[a + 2] && /^(?:occurred|occurs|dawned|dawns|struck|strikes)$/.test(T[a + 2].w || '');""",
    """    const advIt = T[a + 1] && T[a + 1].k === 'w' && ((/^(?:never|suddenly|finally|then|soon|gradually|slowly|only|first)$/.test(T[a + 1].w) && T[a + 2] && /^(?:occurred|occurs|dawned|dawns|struck|strikes)$/.test(T[a + 2].w || '')) || (/^(?:only|just|usually|often|sometimes|always)$/.test(T[a + 1].w) && T[a + 2] && /^(?:takes|took|take)$/.test(T[a + 2].w || '')));""")
rep("""          const canTk = /^(?:can|could|may|might)$/.test(vg.modal || '');
          const vp = done(canTk ? Object.assign({}, vg, { modal: '' }) : vg, canTk ? P('かかることがある', 'aru') : P('かかる', 'v5'), st, b, 'SVO', o,""",
    """          const canTk = /^(?:can|could|may|might)$/.test(vg.modal || '');
          const onlyTk = /^(?:only|just)$/.test(vg.advIt || '');
          const nonTimeTk = !bareDur && !n2.dur && !n2.time && !n2.instant && !n2.coord && !/(?:時間|日|年|分|か月|週間|秒|世紀|円|ドル|お金|努力|勇気|忍耐|練習|手間)/.test(n2.ja || '') && !who;
          if (nonTimeTk) {   // It takes courage to … / It only takes one mistake to …
            const n2s = (n2.ja || '').replace(/^ただ1つの/, 'たった1つの');
            const vpN = done(Object.assign({}, vg, { modal: canTk ? '' : vg.modal }), P(n2s + (onlyTk ? 'だけで十分だ' : 'が必要だ'), 'da'), st, b, 'SVC', o, [infJ + 'には'], { noStative: true });
            return mkClause(null, vpN, '');
          }
          if (onlyTk && !canTk) {   // It only takes a minute to do it → するのに1分しかかからない
            const vpO = done(Object.assign({}, vg, { neg: true }), P('かかる', 'v5'), st, b, 'SVO', o, [(who ? who.ja + 'が' : '') + infJ + 'のに', n2ja + 'しか'], { noStative: true });
            return mkClause(null, vpO, '');
          }
          const vp = done(canTk ? Object.assign({}, vg, { modal: '' }) : vg, canTk ? P('かかることがある', 'aru') : P('かかる', 'v5'), st, b, 'SVO', o,""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
