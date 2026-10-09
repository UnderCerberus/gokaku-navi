import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# … was not English itself（形容詞にもなる名詞 + itself は名詞の補語で読む → 英語自体ではなかった）
rep("""      let a = k < lim ? adjC(T[k]) : null;
      if (a && a.lemma === 'such' && k + 1 < lim && T[k + 1].k === 'w' && DET[T[k + 1].w] !== undefined) a = null;""",
    """      let a = k < lim ? adjC(T[k]) : null;
      if (a && k + 1 < lim && /^(?:itself|themselves)$/.test(T[k + 1].w || '') && !!nounC(T[k])) a = null;   // was not English itself
      if (a && a.lemma === 'such' && k + 1 < lim && T[k + 1].k === 'w' && DET[T[k + 1].w] !== undefined) a = null;""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
