import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# by noon my arms and back were sore → 私の腕と背中は痛かった（体の部分 + and + back は名詞の背中。副詞・動詞の back にしない）
rep("""      if (!nx && c && T[k].k === 'w' && ingVerb(k, lim) && /ing$/.test(T[i].w || '') && items.length === 1) { const gx = gerundNP(k, lim); if (gx) nx = gx; }""",
    """      if (!nx && c && T[k].k === 'w' && ingVerb(k, lim) && /ing$/.test(T[i].w || '') && items.length === 1) { const gx = gerundNP(k, lim); if (gx) nx = gx; }
      if (!nx && c === 'and' && isW(T[k], 'back') && /^(?:arm|arms|leg|legs|neck|shoulder|shoulders|head|foot|feet|hand|hands|knee|knees|stomach|chest|hip|hips|waist|eyes)$/.test(first.head || '') && (k + 1 >= lim || T[k + 1].k === 'p' || (T[k + 1].k === 'w' && (!!BE[T[k + 1].w] || !!MODAL[T[k + 1].w] || /^(?:hurt|hurts|ached|ache|aches|felt|feel|feels)$/.test(T[k + 1].w))))) nx = { ja: '背中', end: k + 1, head: 'back' };""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
