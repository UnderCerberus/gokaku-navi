import io
p = r'C:\Claude\gokaku-navi\js\english\translator.js'
s = io.open(p, encoding='utf-8').read()
old = """          if (boundary && j < n && j > i + 1 && /["”]/.test(p.slice(i + 1, j))) {
            const rest = p.slice(j, j + 60);"""
assert s.count(old) == 1
s = s.replace(old, """          // ただし He said, "…." She smiled … のように、伝達部が引用の前にあるときは引用で文が終わる
          const introQ = /\\b(?:said|says|asked|asks|cried|shouted|whispered|replied|answered|added|thought|explained|yelled|wrote|writes|told\\s+\\w+)\\s*,?\\s*["“][^"”]*$/i.test(p.slice(start, i + 1));
          if (boundary && j < n && j > i + 1 && /["”]/.test(p.slice(i + 1, j)) && !introQ) {
            const rest = p.slice(j, j + 60);""")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)

p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Then Ken went home → それから、ケンは家に帰った（コンマのない文頭の then + 主語）
rep("""      if (t.k === 'w' && /^(?:perhaps|maybe|probably|certainly|surely|fortunately|unfortunately|actually|suddenly|finally|clearly|obviously|hopefully|luckily|sadly|interestingly|naturally|apparently|definitely|honestly)$/.test(t.w) && a + 2 < b""",
    """      if (t.k === 'w' && /^(?:perhaps|maybe|probably|certainly|surely|fortunately|unfortunately|actually|suddenly|finally|clearly|obviously|hopefully|luckily|sadly|interestingly|naturally|apparently|definitely|honestly|then)$/.test(t.w) && !(t.w === 'then' && (a > 0 || (T[a + 1] && T[a + 1].k === 'w' && (DET[T[a + 1].w] !== undefined || (PRON[T[a + 1].w] && PRON[T[a + 1].w].sub))))) && a + 2 < b""")

# lives with … の nonfin（to live with them → 一緒に暮らす）
rep("""&& st.other.some((x) => /と一緒に$/.test(x)) && !o.hasObj) p = P(vg.prog || vg.past || vg.modal || o.sub ? '暮らす' : '暮らしている', vg.prog || vg.past || vg.modal || o.sub ? 'v5' : 'v1');""",
    """&& st.other.some((x) => /と一緒に$/.test(x)) && !o.hasObj) p = P(vg.prog || vg.past || vg.modal || o.sub || vg.nonfin || vg.semi ? '暮らす' : '暮らしている', vg.prog || vg.past || vg.modal || o.sub || vg.nonfin || vg.semi ? 'v5' : 'v1');""")

# leave her garden / leave her family → 離れる
rep("""      else if (L === 'leave' && /(?:^| )(?:area|areas|countryside|hometown|village|villages|town|towns|country|island|islands|region|regions)$/.test(oh) && !vg.passive)""",
    """      else if (L === 'leave' && /(?:^| )(?:area|areas|countryside|hometown|village|villages|town|towns|country|island|islands|region|regions|garden|gardens|farm|farms|family|families|homeland|neighborhood|neighbourhood)$/.test(oh) && !vg.passive)""")

# agreed to move / decided to move → 引っ越す（目的語・行き先なしの move）
rep("""    if (L === 'move' && !objs.length && !vg.passive && o.subj && !o.subj.an && !(o.subj.pron && /^(?:i|you|he|she|we)$/.test(o.subj.pron))""",
    """    if (L === 'move' && !objs.length && !vg.passive && isW(T[vg.idx - 1], 'to') && T[vg.idx - 2] && /^(?:agree|agrees|agreed|decide|decides|decided|plan|plans|planned|want|wants|wanted|have|has|had|need|needs|needed|going|hope|hopes|hoped|refuse|refused|refuses)$/.test(T[vg.idx - 2].w || '') && T.slice(vg.idx + 1, lim).every((x) => x.k === 'p' || /^(?:soon|again|next|this|last|year|month|week|abroad|together|there|someday|eventually)$/.test(x.w || ''))) sense = { particle: '', core: '引っ越す', tr: false };   // She agreed to move → 引っ越すことに同意した
    if (L === 'move' && !objs.length && !vg.passive && o.subj && !o.subj.an && !(o.subj.pron && /^(?:i|you|he|she|we)$/.test(o.subj.pron))""")

rep("""    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""",
    """    ja = ja.replace(/(イルカ|アシカ|動物|鳥|ゾウ|サル|犬|ペンギン|オウム|クジラ|シャチ)で番組を(見|楽しん)/g, '$1のショーを$2').replace(/、みんなは(拍手|笑|喜|驚|歓声|立ち上が)/g, '、みんなが$1').replace(/^それらが([^、。]{2,30}?ので、)/, '$1').replace(/自分の家族と(一緒に)?/g, '家族と$1');   // watched a show with dolphins → イルカのショーを見た / the dolphins jumped high and everyone clapped → みんなが拍手した
    if (tokens.some((x) => x.w === 'had') && tokens.some((x, q) => x.w === 'idea' && tokens[q - 1] && /^(?:an|good|great|brilliant|wonderful|nice|better|new)$/.test(tokens[q - 1].w || '')) && !tokens.some((x) => /^(?:that|about|of|no)$/.test(x.w || ''))) ja = ja.replace(/(良い|いい|すばらしい|素晴らしい|新しい|もっと良い)?考えがあった/, (m0, a0) => (a0 || '') + '考えを思いついた');   // Then Tom had an idea → トムは考えを思いついた
    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
