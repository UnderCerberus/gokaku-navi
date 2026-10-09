import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# 1) 既存の置換「何人かのXが…、… → …Xもいる」は、読点の前が従属節（ので・とき・けれども…）なら当てない
#    （…, as several key members were unable to attend → 何人かの重要なメンバーが出席できなかったので、会社は…）
rep("""(m0, a0, b0) => (/(?:る|う|く|ぐ|す|つ|ぬ|ぶ|む|ない|た)$/.test(b0) ? b0 + a0.replace(/(?:たち|人々)$/, '') + 'もいる' : m0));""",
    """(m0, a0, b0) => (/(?:る|う|く|ぐ|す|つ|ぬ|ぶ|む|ない|た)$/.test(b0) && !/(?:ので|から|とき|けれども|けど|のに|ば|たら|なら|ても|でも|前に|後で|間に|ように|ため)$/.test(b0.split('、')[0]) ? b0 + a0.replace(/(?:たち|人々)$/, '') + 'もいる' : m0));""")

# 2) 主節のあとの「, as + 節」は理由（We stayed home, as it was raining → 雨が降っていたので）
rep("""      case 'as':
        if (sc.past && sc.pred && verbal(sc.pred)""",
    """      case 'as':
        if (typeof sc.end === 'number' && typeof mn.end === 'number' && sc.end > mn.end && T.some((x, q) => q > 2 && isW(x, 'as') && isP(T[q - 1], ',') && q + 1 < T.length && T[q + 1].k === 'w' && ((PRON[T[q + 1].w] && PRON[T[q + 1].w].sub) || DET[T[q + 1].w] !== undefined || /^(?:several|many|most|some|few)$/.test(T[q + 1].w)))) return S('node') + 'ので、';   // …, as it was raining → 雨が降っていたので
        if (sc.past && sc.pred && verbal(sc.pred)""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
