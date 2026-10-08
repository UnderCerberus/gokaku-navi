import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""      if (cE > 1 && !tokens.slice(1, cE).some((x) => x.k === 'w' && (BE[x.w] || MODAL[x.w] || DO[x.w] || HAVE[x.w] || (PRON[x.w] && PRON[x.w].sub) || (!!vc(x, ['3sg', 'past']) && !vc(x, ['pp']) && !adjC(x))))) {""",
    """      if (cE > 1 && !tokens.slice(1, cE).some((x) => x.k === 'w' && (BE[x.w] || MODAL[x.w] || DO[x.w] || HAVE[x.w] || (PRON[x.w] && PRON[x.w].sub) || (!!vc(x, ['3sg', 'past']) && !vc(x, ['pp']) && !adjC(x)) || (!!vc(x, ['base']) && !nounC(x) && !adjC(x) && !vc(x, ['pp', 'ing']) && !PREP[x.w] && !ADV[x.w])))) {   // If bees disappear, … は節（省略ではない）""")

rep("""        const subjE = itE ? 'it' : (tokens[cE + 1] && tokens[cE + 1].k === 'w' && PRON[tokens[cE + 1].w] && PRON[tokens[cE + 1].w].sub ? tokens[cE + 1].w : null);""",
    """        const subjE = itE ? 'it' : (tokens[cE + 1] && tokens[cE + 1].k === 'w' && PRON[tokens[cE + 1].w] && PRON[tokens[cE + 1].w].sub && /^(?:i|you|he|she|we|they|it)$/.test(tokens[cE + 1].w) ? tokens[cE + 1].w : null);""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
