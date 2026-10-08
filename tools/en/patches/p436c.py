import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = """      else if (T[x].k === 'w' && /^(?:and|or)$/.test(T[x].w) && T[x + 1] && T[x + 1].k === 'w' && /^(?:even|also|then)$/.test(T[x + 1].w) && vb(x + 2)) { cuts.push([isP(T[x - 1], ',') ? x - 1 : x, x + 1]); conj = T[x].w; break; }"""
assert s.count(old) == 1
s = s.replace(old, """      else if (T[x].k === 'w' && T[x].w === 'and' && T[x + 1] && T[x + 1].k === 'w' && /^(?:even|also|then)$/.test(T[x + 1].w) && vb(x + 2) && cuts.length) { cuts.push([isP(T[x - 1], ',') ? x - 1 : x, x + 1]); conj = T[x].w; break; }   // can solve puzzles, open jars, and even escape（3 つ以上の列挙だけ）""")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
