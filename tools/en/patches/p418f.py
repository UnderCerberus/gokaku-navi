import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    if (t.w === 'what' && !o.noRel && !o.noWhat) { const wc = whatClause(i, lim); if (wc) return wc; }"
assert s.count(old) == 1
s = s.replace(old, """    if (t.w === 'what' && !o.noRel && !o.noWhat) {
      const wc = whatClause(i, lim); if (wc) return wc;
      // buying what they need and planning their meals（what 節のあとの and + 動名詞は外の並列）
      for (let x = lim - 2; x > i + 2; x--) {
        if (!(isW(T[x], 'and') || isW(T[x], 'or')) || !T[x + 1] || T[x + 1].k !== 'w' || !vc(T[x + 1], ['ing'])) continue;
        const wcS = whatClause(i, x); if (wcS) return wcS;
      }
    }""")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
