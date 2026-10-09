import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# It is raining, so let's stay home → 雨が降っているので、家にいよう（, so / and / but のあとの let's は命令文。使役 にしない）
rep("""        let right = (thenPred && left.subj && T[rs].k === 'w' && !!vc(T[rs], ['3sg', 'past', 'base'])""",
    """        if (isCC && /^(?:so|and|but)$/.test(w) && isW(T[rs], 'let') && rs + 2 < b && !o.sub) {
          const mLs = mark();
          const imLs = imperative(rs, b);
          if (imLs) { const nodeLs = Object.assign({}, left); nodeLs.out = (y) => (w === 'but' ? left.out(Object.assign({}, y || {})) + 'が、' : left.out(Object.assign({}, y || {}, { form: w === 'so' ? 'node' : 'te' })) + (w === 'so' ? 'ので、' : '、')) + imLs.out(y); return wrap(nodeLs); }   // so let's stay home
          fail(mLs);
        }
        let right = (thenPred && left.subj && T[rs].k === 'w' && !!vc(T[rs], ['3sg', 'past', 'base'])""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
