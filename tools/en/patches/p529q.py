import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# encourage anyone who has the chance … → 機会がある人には誰にでも（に の目的語の「〜人は誰でも」）
rep("""    if (n.anyIn && (st.neg || st.vgNeg || st.vgNever || st.vgHardly)) {""",
    """    if (n.bare && /人は誰でも$/.test(n.ja || '') && particle === 'に') return n.ja.replace(/人は誰でも$/, '人には誰にでも');
    if (n.anyIn && (st.neg || st.vgNeg || st.vgNever || st.vgHardly)) {""")

# … the chance to study abroad to take it → その機会を生かす（take + it の先行詞が chance / opportunity なら 生かす）
rep("""      else if (L === 'keep' && objs.length === 1 && /^(?:it|them)$/.test(objs[0].pron || '') && T.some((x, q) => q < vg.idx && /^(?:promise|promises|secret|secrets|rule|rules|resolution|resolutions)$/.test(x.w || ''))) sense = { particle: 'を', core: '守る', tr: true };""",
    """      else if (L === 'keep' && objs.length === 1 && /^(?:it|them)$/.test(objs[0].pron || '') && T.some((x, q) => q < vg.idx && /^(?:promise|promises|secret|secrets|rule|rules|resolution|resolutions)$/.test(x.w || ''))) sense = { particle: 'を', core: '守る', tr: true };
      else if (L === 'take' && objs.length === 1 && objs[0].pron === 'it' && T.some((x, q) => q < vg.idx && /^(?:chance|opportunity|offer)$/.test(x.w || '') && isW(T[q + 1], 'to'))) { sense = { particle: 'を', core: '生かす', tr: true }; objs[0] = Object.assign({}, objs[0], { ja: 'その機会' }); }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
