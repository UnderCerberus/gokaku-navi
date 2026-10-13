import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Someone who wants to stop eating snacks at night might brush their teeth → 自分の歯をみがく / A person who wants to lose weight should change their diet → 自分の食事を
# （単数の人（someone / everyone / a person …）を受ける their は「自分の」。「それらの歯」「彼らの食事」にしない）
rep("""    if (subj && !subj.pron && (subj.pl || subj.coord) && !subj.clause && !subj.gerund && T.some((x) => isW(x, 'their')) && !thAn) cl.parts = cl.parts.map((x) => x.replace(/^(?:それらの|彼らの)/, '自分の').replace(/^彼ら自身の/, '自分自身の'));""",
    """    if (subj && !subj.pron && (subj.pl || subj.coord) && !subj.clause && !subj.gerund && T.some((x) => isW(x, 'their')) && !thAn) cl.parts = cl.parts.map((x) => x.replace(/^(?:それらの|彼らの)/, '自分の').replace(/^彼ら自身の/, '自分自身の'));
    if (subj && !subj.pl && !subj.coord && !subj.clause && !subj.gerund && ((subj.pron && /^(?:someone|somebody|anyone|anybody|everyone|everybody|nobody|each)$/.test(subj.pron)) || (!subj.pron && /^(?:person|individual|user|learner|reader|student|child|customer|patient|driver|employee|worker|speaker|listener|writer|player|traveler|traveller|visitor|consumer|parent|teenager)$/.test(plainSubj(subj).head || ''))) &&
      T.some((x) => isW(x, 'their')) && !T.some((x) => x.k === 'w' && /^(?:they|them|people|students|children|others|friends|parents|members|kids|users|players|workers)$/.test(x.w)) && !thAn) {
      cl.parts = cl.parts.map((x) => x.replace(/^(?:それらの|彼らの)/, '自分の'));
      if (cl.pred && /^[^、。]*?(?:それらの|彼らの)/.test(cl.pred.s)) cl.pred = P(cl.pred.s.replace(/(?:それらの|彼らの)/, '自分の'), cl.pred.cls);
    }""")

# Someone left their umbrella here → ここに傘を置き忘れた（leave + 持ち物 + here / there も「置き忘れる」。「傘を去った」にしない）
rep("""home|school|bus|train|taxi)$/.test(T[objs[0].end + q + 1].w || ''))) sense = { particle: 'を', core: '置き忘れる', tr: true };""",
    """home|school|bus|train|taxi)$/.test(T[objs[0].end + q + 1].w || ''))) sense = { particle: 'を', core: '置き忘れる', tr: true };
      else if (L === 'leave' && !vg.passive && objs.length === 1 && /^(?:umbrella|umbrellas|bag|bags|key|keys|phone|smartphone|wallet|purse|book|books|notebook|glasses|hat|coat|jacket|camera|ticket|passport|lunch|homework|textbook)$/.test(oh) && /^(?:here|there|behind)$/.test((T[objs[0].end] || {}).w || '')) sense = { particle: 'を', core: '置き忘れる', tr: true };""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
