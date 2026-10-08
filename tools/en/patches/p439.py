import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Now Emily feels happy → 今では、エミリーは…（コンマのない Now + 名前）
rep("""|interestingly|naturally|apparently|definitely|honestly|then)$/.test(t.w) && !(t.w === 'then' && (a > 0 ||""",
    """|interestingly|naturally|apparently|definitely|honestly|then|now)$/.test(t.w) && !((t.w === 'then' || t.w === 'now') && (a > 0 ||""")

# taught me how to do it myself → 自分でそれをする方法
rep("""      else if (t.w === 'how' && wh.end === j + 1 && inf.pred.cls !== 'suru' && (/.する$/.test(inf.pred.plain()) || inf.parts.some((x) => /一緒に$/.test(x))) && !/(?:でいる|ている|である|になる)$/.test(inf.pred.plain())) s = vpJoin(inf, 'dict') + '方法';""",
    """      else if (t.w === 'how' && wh.end === j + 1 && inf.pred.plain() === 'する' && inf.parts.some((x) => /を$/.test(x))) s = vpJoin(inf, 'dict') + '方法';   // how to do it myself → 自分でそれをする方法
      else if (t.w === 'how' && wh.end === j + 1 && inf.pred.cls !== 'suru' && (/.する$/.test(inf.pred.plain()) || inf.parts.some((x) => /一緒に$/.test(x))) && !/(?:でいる|ている|である|になる)$/.test(inf.pred.plain())) s = vpJoin(inf, 'dict') + '方法';""")

rep("""    ja = ja.replace(/(?:ミスター)?氏と([^、。]{1,8}?)さん/g, '$1夫妻')""",
    """    ja = ja.replace(/について自信があると感じ(る|た|ている)/g, (m0, a0) => 'に自信があ' + ({ 'る': 'る', 'た': 'った', 'ている': 'る' })[a0]).replace(/自信があると感じ(る|た)/g, (m0, a0) => '自信があ' + (a0 === 'る' ? 'る' : 'った'));   // feels confident about … → …に自信がある
    if (tokens.some((x) => /^(?:bike|bikes|bicycle|bicycles)$/.test(x.w || ''))) ja = ja.replace(/鎖/g, 'チェーン');   // the chain had come off → チェーンが外れていた
    if (tokens.some((x) => x.w === 'quickly') && tokens.some((x) => /^(?:came|come|comes|arrived|arrive|answered|replied|responded)$/.test(x.w || ''))) ja = ja.replace(/早く(来|到着|答え|返事)/g, 'すぐに$1');   // He came quickly → すぐに来た
    ja = ja.replace(/(?:ミスター)?氏と([^、。]{1,8}?)さん/g, '$1夫妻')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
