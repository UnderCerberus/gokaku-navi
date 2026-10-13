import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# showed me how to clean the cages and prepare food for the animals → かごを掃除して、動物のえさを準備する方法を教えた
# （how to + 動詞句の並列は全体に「方法」。最後の動詞だけ「〜の仕方」にして「掃除して、…準備の仕方を」にしない）
rep("""      if (destM) s = destM + 'への' + (inf.vg.lemma === 'come' ? '来方' : '行き方');   // how to get to the station → 駅への行き方""",
    """      const coordHw = t.w === 'how' && wh.end === j + 1 && T.slice(j + 3, inf.end).some((x, q) => x.k === 'w' && /^(?:and|or)$/.test(x.w) && T[j + 4 + q] && T[j + 4 + q].k === 'w' && !!vc(T[j + 4 + q], ['base']) && (!nounC(T[j + 4 + q]) || (T[j + 5 + q] && T[j + 5 + q].k === 'w' && (DET[T[j + 5 + q].w] !== undefined || (!!PRON[T[j + 5 + q].w] && !PRON[T[j + 5 + q].w].sub)))));
      if (coordHw && !destM) s = vpJoin(inf, 'dict') + '方法';
      else if (destM) s = destM + 'への' + (inf.vg.lemma === 'come' ? '来方' : '行き方');   // how to get to the station → 駅への行き方""")

# show + 人 + how to …（「〜方法」で終わるときも「教える」）
rep("""        const coreW = L === 'tell' || (L === 'show' && /方$/.test(sW)) ? P('教える', 'v1')""",
    """        const coreW = L === 'tell' || (L === 'show' && /(?:方|方法)$/.test(sW)) ? P('教える', 'v1')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
