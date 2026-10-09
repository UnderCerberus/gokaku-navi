import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# could not hear what she was saying → 彼女が言っていること（what she was + saying を「どんな人間か + 言っている」に分けない）
rep("""  function objBefore(i, lim, ok) {
    for (let q = i + 1; q < lim; q++) {
      if (!T[q] || !ok(T[q], q)) continue;""",
    """  function objBefore(i, lim, ok) {
    for (let q = i + 1; q < lim; q++) {
      if (!T[q] || !ok(T[q], q)) continue;
      if (T[i].k === 'w' && /^(?:what|how|why|where|when|who|which|whether)$/.test(T[i].w) && q - 1 > i && T[q - 1].k === 'w' && BE[T[q - 1].w] && T[q].k === 'w' && !!vc(T[q], ['ing'])) continue;   // what she was saying（be + ～ing は節の中の進行形）""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
