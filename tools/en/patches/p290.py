import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""      else if (L === 'beat' && objs.length >= 1 && (objs[0].an || /^(?:them|him|her|us|you|me)$/.test(objs[0].pron || '')""",
    """      else if (L === 'beat' && objs.length >= 1 && (objs[0].an || /^(?:them|him|her|us|you|me|theirs|ours|yours|mine|hers|his)$/.test(objs[0].pron || '')""")

rep("""    ja = ja.replace(/ということは哀れみだ/g, 'のは残念だ')""",
    """    if (tokens.some((x) => x.w === 'team' || x.w === 'teams')) ja = ja.replace(/(彼らの|私たちの|あなたの|あなたたちの|彼の|彼女の)ものに勝/g, '$1チームに勝').replace(/船長/g, 'キャプテン');   // Our school team beat theirs → 彼らのチームに勝った / the captain of the team → チームのキャプテン
    if (tokens.some((x) => /^(?:won|win|wins|lost|lose|loses|beat|beats|leads|led)$/.test(x.w || '')) && tokens.some((x, q) => x.w === 'by' && tokens[q + 1] && (tokens[q + 1].k === 'num' || NUMW[tokens[q + 1].w] !== undefined))) ja = ja.replace(/([0-9０-９]+)(秒|点|ポイント|票|ゴール|メートル|センチメートル)(?:だけ|までに|で)/, (m0, n0, u0) => n0 + (u0 === 'ポイント' ? '点' : u0) + '差で');   // Our team won the game by three points → 3点差で試合に勝った
    if (tokens.some((x) => x.w === 'score') && tokens.some((x) => x.w === 'tied')) ja = ja.replace(/^(?:得点|スコア)は(.*?)結ばれ(た|ている)/, (m0, a0) => (a0 ? a0.replace(/に$/, 'には') : '') + '同点だった');   // The score was tied at the end of the first half → 前半の終わりには同点だった
    if (tokens.some((x, q) => x.w === 'on' && tokens.slice(q + 1, q + 5).some((y) => y.w === 'team'))) ja = ja.replace(/チームにいる/g, 'チームに入っている').replace(/チームにいた/g, 'チームに入っていた');   // I'm on the soccer team → サッカーチームに入っている
    if (tokens.some((x, q) => x.w === 'hours' && !(q > 0 && (tokens[q - 1].k === 'num' || NUMW[tokens[q - 1].w] !== undefined || /^(?:few|several|many|two|three)$/.test(tokens[q - 1].w || '')))) && tokens.some((x) => /^(?:spend|spends|spent|spending)$/.test(x.w || ''))) ja = ja.replace(/をして時間を過ご/, 'をして何時間も過ご').replace(/のに時間を費や/, 'のに何時間も費や');   // He spends hours playing video games → 何時間もテレビゲームをして過ごす
    ja = ja.replace(/ということは哀れみだ/g, 'のは残念だ')""")

rep("""'wet paint': 'ペンキ塗りたて', """,
    """'wet paint': 'ペンキ塗りたて', 'what is the score': '何対何ですか', 'who is winning': 'どちらが勝っていますか', 'we won': '私たちは勝った', 'we lost': '私たちは負けた', """)

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
