import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# they do not study enough → 十分に勉強しない / He doesn't sleep enough → 十分に眠らない（自動詞のあとの enough は副詞。十分な量を にしない）
rep("""      if (t.k === 'w' && t.w === 'only' && j0 === j && objs.length === 0 && !vg.passive && !vg.neg && isW(T[j0 + 1], 'one') && (""",
    """      if (t.k === 'w' && t.w === 'enough' && j0 === j && objs.length === 0 && !vg.passive && /^(?:study|sleep|exercise|rest|work|practice|prepare|train|relax|walk|run|laugh|listen|move|save|eat|drink|try|care|think|read)$/.test(vg.lemma) && (j0 + 1 >= lim || T[j0 + 1].k === 'p' || /^(?:to|and|but|or|because|so|when|if|before|after|in|at|on|for|during|these|this|every|each|now|today|tonight|yesterday|last|lately|recently|yet|anymore|anyway)$/.test(T[j0 + 1].w || ''))) { st.manner.push('十分に'); j = j0 + 1; continue; }
      if (t.k === 'w' && t.w === 'only' && j0 === j && objs.length === 0 && !vg.passive && !vg.neg && isW(T[j0 + 1], 'one') && (""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
