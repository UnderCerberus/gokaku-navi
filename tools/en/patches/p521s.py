import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# He knows her better than I do / I like her more than him / treat her better → her は目的語（後ろに名詞のない比較級。所有格 her にしない）
rep("""    const nomNext = !!nx && nx.k !== 'p' && nx.k !== 'pos' && !PRON_ONLY[nx.w] && !(t.w === 'her' && (NO_COMPOUND[nx.w] || /^(?:yesterday|today|tomorrow|tonight|now|then|again|too|also|first|later|soon|already|every|last|next|this|once|twice)$/.test(nx.w))) &&""",
    """    const nomNext = !!nx && nx.k !== 'p' && nx.k !== 'pos' && !PRON_ONLY[nx.w] && !(t.w === 'her' && (NO_COMPOUND[nx.w] || /^(?:yesterday|today|tomorrow|tonight|now|then|again|too|also|first|later|soon|already|every|last|next|this|once|twice)$/.test(nx.w))) &&
      !(t.w === 'her' && /^(?:better|worse|more|less|best|most|least)$/.test(nx.w) && (i + 2 >= lim || T[i + 2].k === 'p' || /^(?:than|now|then|today|again|anymore|and|but|or|because|when|if|every|each|this|these|after|before|since|in|at|on|for|with|from|to|by|as)$/.test(T[i + 2].w || ''))) &&""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
