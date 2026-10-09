import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# not … as A but as B / not … to A but to B（not と組の but の後ろが as・前置詞・to で始まるなら節の分割点にしない）
rep("""      const isCC = t.k === 'w' && /^(?:and|but|or|so|yet)$/.test(t.w);
      // that A or that B は that 節の並列（節の分割点にしない）""",
    """      const isCC = t.k === 'w' && /^(?:and|but|or|so|yet)$/.test(t.w);
      if (isCC && t.w === 'but' && T[j + 1] && T[j + 1].k === 'w' && (/^(?:as|to|for|in|on|at|by|with|from|because)$/.test(T[j + 1].w)) && T.slice(a, j).some((x) => isW(x, 'not') || isW(x, "n't"))) continue;
      // that A or that B は that 節の並列（節の分割点にしない）""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
