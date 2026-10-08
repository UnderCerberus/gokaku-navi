import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""    if (seq(0, ['make', 'sure']) && b > 3 && !isW(T[2], 'to')) {
      const kMs = isW(T[2], 'that') ? 3 : 2;
      const cMs = sentence(kMs, b, { sub: true });
      if (cMs && cMs.pred && verbal(cMs.pred)) {
        const omMs = cMs.subj && cMs.subj.pron === 'you' ? 'you' : null;
        return { ok: true, ja: '必ず' + cMs.out({ form: 'attr', past: false, omit: omMs, part: 'が' }).replace(/だろう$/, '') + 'ようにしてください。', sp: '', names: ['idiom'], sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() };
      }
      reset(tokens);
    }""",
    """    // But please make sure you finish it → でも、必ずそれを終えるようにしてください（つなぎ言葉・please つき）
    let s0Ms = 0, ldMs = '';
    if (T[0] && /^(?:but|so|and|now|then)$/.test(T[0].w || '') && b > 4) { ldMs = { but: 'でも、', so: 'だから、', and: 'それから、', now: 'さあ、', then: 'それでは、' }[T[0].w]; s0Ms = isP(T[1], ',') ? 2 : 1; }
    if (isW(T[s0Ms], 'please')) s0Ms++;
    if (seq(s0Ms, ['make', 'sure']) && b > s0Ms + 3 && !isW(T[s0Ms + 2], 'to')) {
      const kMs = s0Ms + (isW(T[s0Ms + 2], 'that') ? 3 : 2);
      const cMs = sentence(kMs, b, { sub: true });
      if (cMs && cMs.pred && verbal(cMs.pred)) {
        const omMs = cMs.subj && cMs.subj.pron === 'you' ? 'you' : null;
        return { ok: true, ja: ldMs + '必ず' + cMs.out({ form: 'attr', past: false, omit: omMs, part: 'が' }).replace(/だろう$/, '') + 'ようにしてください。', sp: '', names: ['idiom'], sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() };
      }
      reset(tokens);
    }
    // I made sure the door was locked → 私はドアに鍵がかかっていることを確かめた
    if (b > 4 && T[0].k === 'w' && PRON[T[0].w] && PRON[T[0].w].sub && isW(T[1], 'made') && isW(T[2], 'sure') && !isW(T[3], 'to')) {
      const kMd = isW(T[3], 'that') ? 4 : 3;
      const cMd = sentence(kMd, b, { sub: true });
      if (cMd && cMd.pred) {
        const sMd = np(0, 1, {});
        return { ok: true, ja: (sMd ? sMd.ja + 'は' : '') + cMd.out({ form: 'attr', part: 'が' }).replace(/だ$/, 'である') + 'ことを確かめた。', sp: '', names: ['idiom'], sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() };
      }
      reset(tokens);
    }""")

rep("""'wet paint': 'ペンキ塗りたて', """,
    """'wet paint': 'ペンキ塗りたて', 'that is ok': 'いいですよ', 'that is okay': 'いいですよ', 'it is ok': '大丈夫です', 'it is okay': '大丈夫です', """)

# Hello?（電話の第一声）→ もしもし
rep("""    // 頻度だけの答え: Every fifteen minutes.""",
    """    if (b === 1 && isW(T[0], 'hello') && tokens[1] && isP(tokens[1], '?')) return { ok: true, ja: 'もしもし。', sp: '', names: ['fixed'], sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() };   // Hello? → もしもし
    // 頻度だけの答え: Every fifteen minutes.""")

rep("""    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""",
    """    if (tokens.some((x, q) => x.w === 'for' && tokens[q + 1] && /^(?:a|one)$/.test(tokens[q + 1].w || '') && tokens[q + 2] && /^(?:minute|moment|second)$/.test(tokens[q + 2].w || '')) && tokens.some((x) => /^(?:talk|speak|wait|come|borrow|see|look|use|hold|stay|sit)$/.test(x.w || ''))) ja = ja.replace(/(?:1分間|一瞬|1秒間|少しの間)(?:あなたと)?(話|待|来|借|見|使|座|い)/, (m0, a0) => 'ちょっと' + (a0 === '話' ? 'お話し' : a0)).replace(/ちょっとお話して/, 'ちょっとお話しして');   // Can I talk to you for a minute? → ちょっとお話ししてもよいですか
    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
