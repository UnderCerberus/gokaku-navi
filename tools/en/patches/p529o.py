import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# The money you save now will help you later / The decisions we make today will shape our future
# （主語の関係詞節の動詞の直後の now / today は、述語に別の時の語（later / future など）があれば関係詞節に入れる。今日の私たちが にしない）
rep("""        !(s - 2 > a && T[s - 2].k === 'w' && !!vc(T[s - 2], ['base', '3sg', 'past']) && !MODAL[T[s - 2].w] && T.slice(a, s - 2).some((x) => x.k === 'w' && /^(?:who|which|that)$/.test(x.w))) &&""",
    """        !(s - 2 > a && T[s - 2].k === 'w' && !!vc(T[s - 2], ['base', '3sg', 'past']) && !MODAL[T[s - 2].w] && T.slice(a, s - 2).some((x) => x.k === 'w' && /^(?:who|which|that)$/.test(x.w))) &&
        !(/^(?:now|today|tonight|yesterday)$/.test(T[s - 1].w || '') && s - 2 > a && T[s - 2].k === 'w' && !!vc(T[s - 2], ['base', 'past', '3sg']) && T.slice(a, s - 2).some((x) => x.k === 'w' && PRON[x.w] && PRON[x.w].sub) && T.slice(p).some((x) => x.k === 'w' && /^(?:tomorrow|later|future|next|someday|eventually|soon)$/.test(x.w))) &&""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
