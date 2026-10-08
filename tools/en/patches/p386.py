import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# A: Hi, Ken. / Mom: Did you finish your homework? → A：こんにちは、ケン。／お母さん：宿題は終わりましたか（会話の話し手の名札）
rep("""    if (ci === 1 && body[0].k === 'w') {
      const LABEL_JA = {""",
    """    if (ci === 1 && body[0].k === 'w' && body.length > 2) {
      const SPK = { mom: 'お母さん', mother: '母', dad: 'お父さん', father: '父', teacher: '先生', student: '生徒', man: '男性', woman: '女性', boy: '男の子', girl: '女の子', clerk: '店員', waiter: 'ウエイター', waitress: 'ウエイトレス', customer: '客', doctor: '医師', nurse: '看護師', interviewer: 'インタビュアー', host: '司会者', guide: 'ガイド', driver: '運転手', grandma: 'おばあちゃん', grandpa: 'おじいちゃん', son: '息子', daughter: '娘', brother: '兄', sister: '姉', friend: '友達', officer: '警察官', receptionist: '受付係', staff: 'スタッフ', operator: 'オペレーター', reporter: '記者', coach: 'コーチ', principal: '校長' };
      const s0 = body[0].s || body[0].w;
      const spkJa = /^[A-Z]$/.test(s0) ? s0 : ((/^[A-Z]/.test(s0) || body[0].first) && SPK[body[0].w] ? SPK[body[0].w] : ((/^[A-Z]/.test(s0) || body[0].first) && NAME_JA[body[0].w] ? NAME_JA[body[0].w] : null));
      if (spkJa) {
        const tSp = body.slice(ci + 1).concat(endP).map((x, k) => Object.assign({}, x, { i: k, first: k === 0 }));
        const rSp = translate1(tSp);
        reset(tokens);
        if (rSp && rSp.ok) { absorb(acc, rSp); return fin(null, spkJa + '：' + rSp.ja); }
      }
    }
    if (ci === 1 && body[0].k === 'w') {
      const LABEL_JA = {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
