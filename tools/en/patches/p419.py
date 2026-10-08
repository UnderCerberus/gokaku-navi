import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""&& !T.some((x, q) => (x.w === 'more' && isW(T[q + 1], 'and') && isW(T[q + 2], 'more')) || x.w === 'than')""",
    """&& !T.some((x, q) => (x.w === 'more' && isW(T[q + 1], 'and') && isW(T[q + 2], 'more')) || (x.w === 'than' && !(T[q + 1] && (T[q + 1].k === 'num' || NUMW[T[q + 1].w] !== undefined))))""")

rep("""'by the way': 'ところで', 'first of all': 'まず第一に',""",
    """'by the way': 'ところで', 'either way': 'いずれにせよ', 'first of all': 'まず第一に',""")

rep("""    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""",
    """    ja = ja.replace(/^いくつかの([^、。]{1,8})では、/, '一部の$1では、').replace(/^他の人たちは(.+?)と(言う|考える|思う|信じている|主張する|感じる|考えている)。$/, '$1と$2人もいる。');   // In some restaurants, → 一部のレストランでは / Others say that … → …と言う人もいる
    if (tokens.some((x, q) => /^(?:type|types|kind|kinds)$/.test(x.w || '') && tokens[q + 1] && tokens[q + 1].w === 'of')) ja = ja.replace(/(新しい|さまざまな|異なる|多くの|いろいろな|別の|同じ|この|その|あらゆる)型の/g, '$1種類の');   // new types of jobs → 新しい種類の仕事
    if (tokens.some((x) => /^(?:compete|competes|competed|competing)$/.test(x.w || '')) && tokens.some((x) => /^(?:olympic|olympics|games|tournament|race|races|championship|championships|athletes|athlete|event|events|contest)$/.test(x.w || '')) && !tokens.some((x) => /^(?:with|against|for)$/.test(x.w || '') && false)) ja = ja.replace(/競争(する|した|して|し)/g, '出場$1');   // Women were allowed to compete … → 出場することを許された
    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
