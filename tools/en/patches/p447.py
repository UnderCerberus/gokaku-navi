import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# AI could replace many human jobs in the future / experts warn that robots could replace … → 取って代わるかもしれない（未来の文脈・現在の伝達動詞の中の could は可能性）
rep("""      case 'could':
""",
    """      case 'could':
        if (!vg.perfect && !neg && !o.subjunctive && !o.wish && !o.q && verbal(p) && (T.some((x, q) => x.k === 'w' && (/^(?:future|someday|eventually|soon|tomorrow)$/.test(x.w) || (x.w === 'one' && isW(T[q + 1], 'day') && q > 0))) || (o.sub && T.some((x) => x.k === 'w' && /^(?:warn|warns|fear|fears|say|says|think|thinks|believe|believes|argue|argues|predict|predicts|suggest|suggests|worry|worries|claim|claims|worried|concerned|afraid)$/.test(x.w)) && !T.some((x) => x.k === 'w' && /^(?:said|thought|believed|argued|predicted|claimed|warned|feared)$/.test(x.w)))) && !T.some((x) => x.k === 'w' && /^(?:yesterday|ago|then)$/.test(x.w))) { p = P(p.plain() + 'かもしれない', 'i'); past = false; break; }
""")

rep("""    ja = ja.replace(/人々でいっぱい/g, '人でいっぱい')""",
    """    if (tokens.some((x, q) => /^(?:can|could)$/.test(x.w || '') && tokens[q + 1] && tokens[q + 1].w === 'now')) ja = ja.replace(/(は|が)今(?!日|年|月|週|朝|夜|晩|度|後|すぐ|まで|では)/, '$1今では');   // AI can now translate languages → AIは今では言語を翻訳したり…
    ja = ja.replace(/速く(分析|計算|判断|理解|反応|処理)/g, 'すばやく$1');
    ja = ja.replace(/人々でいっぱい/g, '人でいっぱい')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
