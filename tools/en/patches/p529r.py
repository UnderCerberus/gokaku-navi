import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# … was not English itself → 英語自体ではなかった（補語・目的語の名詞句のあとの文末の itself / themselves も強調の 自体）
rep("""      if (t.k === 'w' && /^(?:himself|herself|themselves|itself|myself|ourselves|yourself|yourselves)$/.test(t.w) && T[j + 1] && T[j + 1].k === 'w' && (!!MODAL[T[j + 1].w] || !!BE[T[j + 1].w] || !!HAVE[T[j + 1].w] || !!DO[T[j + 1].w] || (!!vc(T[j + 1], ['3sg', 'past', 'base']) && !nounC(T[j + 1])) || (!!ADV[T[j + 1].w] && /^(?:also|never|always|often|still|really|clearly)$/.test(T[j + 1].w))) &&""",
    """      if (t.k === 'w' && /^(?:himself|herself|themselves|itself|myself|ourselves|yourself|yourselves)$/.test(t.w) && ((T[j + 1] && T[j + 1].k === 'w' && (!!MODAL[T[j + 1].w] || !!BE[T[j + 1].w] || !!HAVE[T[j + 1].w] || !!DO[T[j + 1].w] || (!!vc(T[j + 1], ['3sg', 'past', 'base']) && !nounC(T[j + 1])) || (!!ADV[T[j + 1].w] && /^(?:also|never|always|often|still|really|clearly)$/.test(T[j + 1].w)))) || (!node.pron && /^(?:itself|themselves)$/.test(t.w) && j > 0 && T.slice(0, j).some((x) => x.k === 'w' && !!BE[x.w]) && (!T[j + 1] || T[j + 1].k === 'p' || /^(?:but|and)$/.test(T[j + 1].w || '')))) &&""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
