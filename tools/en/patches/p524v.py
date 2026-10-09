import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# I know her well / Knowing her well, … / knows her very well → 彼女をよく知っている（her + well は目的格 + 副詞。彼女の井戸 にしない）
rep("""      !(t.w === 'her' && /^(?:better|worse|more|less|best|most|least)$/.test(nx.w) && (i + 2 >= lim""",
    """      !(t.w === 'her' && !(i > 0 && T[i - 1].k === 'w' && !!PREP[T[i - 1].w]) && ((nx.w === 'well' && (i + 2 >= lim || T[i + 2].k === 'p' || /^(?:and|but|or|because|when|if|now|enough|after|before|since|in|at|on|for|with|to|by|as|than|today|again)$/.test(T[i + 2].w || ''))) || (/^(?:very|so|too|quite|really|pretty|fairly)$/.test(nx.w) && isW(T[i + 2], 'well') && (i + 3 >= lim || T[i + 3].k === 'p' || /^(?:and|but|or|because|when|if|now|that|after|before|since|in|at|on|for|with|to|by|as|than)$/.test(T[i + 3].w || ''))))) &&
      !(t.w === 'her' && /^(?:better|worse|more|less|best|most|least)$/.test(nx.w) && (i + 2 >= lim""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
