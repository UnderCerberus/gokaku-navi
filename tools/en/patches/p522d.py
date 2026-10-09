import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# The more languages a child is exposed to at an early age, … / the house we lived in for ten years
#（目的語が前に出た前置詞のあとに、別の前置詞句や時の副詞が続いてもよい）
rep("""    if (j >= lim) {
      // 前置詞の目的語が前に出ている（疑問詞・関係詞）
      if (o.gap && !o.gap.used && o.gap.type === 'np' && key) {""",
    """    if (j >= lim || (o.gap && !o.gap.used && o.gap.type === 'np' && key && !idi && !/^(?:as|than|of|like)$/.test(key) && i > 0 && T[i - 1].k === 'w' && ((!!vc(T[i - 1], ['pp']) && T.slice(Math.max(0, i - 4), i - 1).some((x) => x.k === 'w' && (!!BE[x.w] || /^(?:get|got|gets|become|became)$/.test(x.w)))) || (!!adjC(T[i - 1]) && !vc(T[i - 1], ['base', '3sg', 'past', 'pp'])) || /^(?:live|lives|lived|living|go|goes|went|gone|going|come|comes|came|coming|talk|talks|talked|talking|speak|speaks|spoke|spoken|work|works|worked|working|travel|travels|traveled|travelled|depend|depends|depended|rely|relies|relied|look|looks|looked|listen|listens|listened|wait|waits|waited|stay|stays|stayed|sit|sits|sat|sleep|slept|play|plays|played|grow|grew|grown|deal|dealt|agree|agreed|belong|belongs|belonged|care|cared|think|thought|dream|dreamed|dreamt|worry|worried|complain|complained|refer|referred|argue|argued|laugh|laughed|walk|walked|run|ran|arrive|arrived|grew|move|moved|moving)$/.test(T[i - 1].w)) && T[j].k === 'w' && ((PREP[T[j].w] && !/^(?:of|than|as|to)$/.test(T[j].w) && !(T[j + 1] && T[j + 1].k === 'w' && PREP[T[j + 1].w])) || /^(?:yesterday|today|tonight|tomorrow|last|every|now|then|again|ago|recently|once|twice|already|later|together|alone|anymore|lately)$/.test(T[j].w)))) {
      // 前置詞の目的語が前に出ている（疑問詞・関係詞）
      if (o.gap && !o.gap.used && o.gap.type === 'np' && key) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
