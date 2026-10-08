import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""'wet paint': 'ペンキ塗りたて', """,
    """'wet paint': 'ペンキ塗りたて', 'that works for me': 'それで大丈夫です', 'that works': 'それでいいです', 'that works fine': 'それで大丈夫です', 'that works for us': '私たちはそれで大丈夫です', 'does that work for you': 'それで大丈夫ですか', 'does that work': 'それで大丈夫ですか', 'would that work for you': 'それで大丈夫ですか', 'that would work': 'それなら大丈夫です', 'that will work': 'それで大丈夫です', 'i am running late': '遅れそうです', 'i am running a little late': '少し遅れそうです', 'i am running a bit late': '少し遅れそうです', 'we are running late': '遅れそうです', 'tell her i said hi': '彼女によろしく伝えてね', 'tell him i said hi': '彼によろしく伝えてね', 'tell them i said hi': 'みんなによろしく伝えてね', 'tell her i said hello': '彼女によろしく伝えてね', 'tell him i said hello': '彼によろしく伝えてね', 'say hi to her for me': '彼女によろしく伝えてね', 'say hi to him for me': '彼によろしく伝えてね', 'it is just around the corner': 'すぐそこです', """)

# How about around ten? → 10時ごろはどうですか
rep("""    if (b === 3 && isW(T[0], 'how') && isW(T[1], 'about') && T[2].k === 'w' && NUMW[T[2].w] >= 1 && NUMW[T[2].w] <= 12) return { ok: true, ja: NUMW[T[2].w] + '時はどうですか。', sp: '', names: ['fixed'], sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() };""",
    """    if (b === 3 && isW(T[0], 'how') && isW(T[1], 'about') && T[2].k === 'w' && NUMW[T[2].w] >= 1 && NUMW[T[2].w] <= 12) return { ok: true, ja: NUMW[T[2].w] + '時はどうですか。', sp: '', names: ['fixed'], sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() };
    if (b === 4 && isW(T[0], 'how') && isW(T[1], 'about') && /^(?:around|about)$/.test(T[2].w || '') && T[3].k === 'w' && NUMW[T[3].w] >= 1 && NUMW[T[3].w] <= 12) return { ok: true, ja: NUMW[T[3].w] + '時ごろはどうですか。', sp: '', names: ['fixed'], sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() };   // How about around ten? → 10時ごろはどうですか
    // Not since she moved to Canada. / Not since last year. → 彼女がカナダに引っ越してからは一度もない / 去年からは一度もない
    if (b > 2 && seq(0, ['not', 'since']) && !tokens.__notSince) {
      const mNs = mark();
      const nNs = np(2, b, { noRel: true });
      if (nNs && nNs.end === b && (nNs.time || /(?:年|月|週|日|曜日|夏|冬|春|秋|朝|晩|夜)$/.test(nNs.ja))) return { ok: true, ja: nNs.ja.replace(/に$/, '') + 'からは一度もない。', sp: '', names: ['fixed'], sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() };
      fail(mNs);
      const tNs = tokens.slice(2).map((x, k) => Object.assign({}, x, { i: k, first: k === 0, cap: k === 0 ? false : x.cap }));
      tNs.__notSince = true;
      const rNs = translate1(tNs);
      reset(tokens);
      if (rNs && rNs.ok && /[たっ]。$/.test(rNs.ja)) return Object.assign({}, rNs, { ja: rNs.ja.replace(/^([^、。]+?)は/, '$1が').replace(/。$/, '') + '後は一度もない。', names: rNs.names.concat(['fixed']) });
    }""")

# save me a seat → 席を取っておく
rep("""      else if (L === 'slow' && /(?:^| )(?:inflation|growth""",
    """      else if (L === 'save' && /(?:^| )(?:seat|seats|place|spot|table|piece|slice|room)$/.test(oh)) sense = { particle: 'を', core: '取っておく', tr: true };   // Can you save me a seat? → 席を取っておいてくれますか
      else if (L === 'slow' && /(?:^| )(?:inflation|growth""")

rep("""    ja = ja.replace(/(利用者|ユーザー|消費者)が彼らの/g, '$1が');""",
    """    ja = ja.replace(/(利用者|ユーザー|消費者)が彼らの/g, '$1が');
    if (tokens.some((x) => x.w === 'help') && tokens.some((x) => x.w === 'move')) ja = ja.replace(/動くのを手伝/, '引っ越しを手伝').replace(/私が(今週末|週末|明日|来週|土曜日|日曜日)?引っ越しを手伝/, '$1引っ越しを手伝');   // help me move this weekend → 今週末引っ越しを手伝って""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
