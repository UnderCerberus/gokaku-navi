import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""      else if (t.w === 'how' && wh.end === j + 1 && inf.pred.plain() === 'する' && inf.parts.some((x) => /を$/.test(x))) s = vpJoin(inf, 'dict') + '方法';""",
    """      else if (t.w === 'how' && wh.end === j + 1 && inf.pred.plain() === 'する' && inf.parts.some((x) => /^(?:それ|これ|あれ)を$/.test(x))) s = vpJoin(inf, 'dict') + '方法';""")

rep("""    if (tokens.some((x) => x.w === 'quickly') && tokens.some((x) => /^(?:came|come|comes|arrived|arrive|answered|replied|responded)$/.test(x.w || ''))) ja = ja.replace(/早く(来|到着|答え|返事)/g, 'すぐに$1');""",
    """    if (tokens.some((x) => x.w === 'quickly') && tokens.some((x) => /^(?:came|arrived|answered|replied|responded)$/.test(x.w || ''))) ja = ja.replace(/早く(来|到着|答え|返事)/g, 'すぐに$1');""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
