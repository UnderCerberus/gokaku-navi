import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""      if (cnt > 0 && head === 'way') break;                               // the way S V（way のあとは節）
""",
    """      if (cnt > 0 && head === 'way') break;                               // the way S V（way のあとは節）
      // Is this water safe to drink? / Is this area safe?（be 動詞のあとの名詞 + 形容詞にもなる語は複合名詞にしない: 水の金庫 にしない）
      if (cnt > 0 && /^(?:safe|clean|fine|free|ready|warm|cold|kind|quiet|dry|wet|full|empty|open|clear|alive|alone|afraid|enough|dangerous|healthy|fresh|sweet|sour|bitter|spicy)$/.test(t.w) && !!adjC(t) && (j + 1 >= lim || T[j + 1].k === 'p' || /^(?:to|enough|for|and|or|in|at|here|there|now|today|anymore)$/.test(T[j + 1].w || '')) && T.slice(0, i).some((x) => /^(?:is|are|was|were|am|be|been|being|seem|seems|seemed|look|looks|looked|feel|feels|felt|become|becomes|became|get|gets|got|keep|keeps|kept|stay|stays|stayed)$/.test(x.w || ''))) break;
""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
