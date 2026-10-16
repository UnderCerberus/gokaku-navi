import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# forget almost everything a few weeks later → 数週間後にほとんどすべてを忘れる
# （-thing 代名詞のあとの「期間 + later / earlier」は後置の形容詞ではなく時の副詞。「数週間遅いすべて」にしない）
rep("""        if (aj && !ajNoun && !(aj.end < lim && isW(T[aj.end], 'than'))) {
          pick(aj.idx, aj.e);
          const f1 = aj.lemma === 'hot'""",
    """        if (aj && !ajNoun && !(aj.end < lim && isW(T[aj.end], 'than')) && !(aj.end - 1 > k1 && /^(?:later|earlier|ago)$/.test(T[aj.end - 1].w || ''))) {
          pick(aj.idx, aj.e);
          const f1 = aj.lemma === 'hot'""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
