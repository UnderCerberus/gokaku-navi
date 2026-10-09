import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Children learn through play → 遊びを通して（冠詞のない play は遊び。through + 学び方の名詞は を通して）
rep("""      if (c.lemma === 'concern' && c.e && w === '関心' &&""",
    """      if (c.lemma === 'play' && c.e && w === '劇' && c.form !== 'pl' && j > 0 && /^(?:through|by|during|in|at|of|and|for)$/.test(T[j - 1].w || '') && !(T[j + 1] && T[j + 1].k === 'w' && isW(T[j + 1], 'by'))) w = '遊び';   // learn through play → 遊びを通して
      if (c.lemma === 'concern' && c.e && w === '関心' &&""")
rep("""        if (obj.head && /^(?:experience|experiences|study|studies|practice|effort|efforts|work|activity|activities|education|reading|research|trial|trials|""",
    """        if (obj.head && /^(?:experience|experiences|play|games|game|study|studies|practice|effort|efforts|work|activity|activities|education|reading|research|trial|trials|""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
