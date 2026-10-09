import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# be able to A and B → AしたりBしたりできる（be able to も並列の述語全体にかける。前は A だけが「できる」になっていた）
rep("""      if (/^(?:have|has|had)$/.test(tx.w) && isW(T[x + 1], 'to') && T[x + 2] && T[x + 2].k === 'w' && !!vc(T[x + 2], ['base']) && !BE[T[x + 2].w]) { mi = x; mlen = 2; break; }   // have to A and B
""", """      if (/^(?:have|has|had)$/.test(tx.w) && isW(T[x + 1], 'to') && T[x + 2] && T[x + 2].k === 'w' && !!vc(T[x + 2], ['base']) && !BE[T[x + 2].w]) { mi = x; mlen = 2; break; }   // have to A and B
      if (/^(?:am|is|are|was|were)$/.test(tx.w) && isW(T[x + 1], 'able') && isW(T[x + 2], 'to') && T[x + 3] && T[x + 3].k === 'w' && !!vc(T[x + 3], ['base']) && !BE[T[x + 3].w]) { mi = x; mlen = 3; break; }   // are able to A and B
""")
rep("""    if (T[mi].w !== 'can') {
      const bl = begins[begins.length - 1];""",
    """    if (T[mi].w !== 'can' && mlen !== 3) {
      const bl = begins[begins.length - 1];""")
rep("""    const mw = mlen === 2 ? 'haveto' : T[mi].w;   // out は別のトークン列の上で呼ばれることがあるので、ここで取っておく""",
    """    const mw = mlen === 2 ? 'haveto' : (mlen === 3 ? 'can' : T[mi].w);   // out は別のトークン列の上で呼ばれることがあるので、ここで取っておく
    const ablePast = mlen === 3 && /^(?:was|were)$/.test(T[mi].w);   // was able to A and B → AしたりBしたりできた""")
rep("""        return s + (f === 'te' ? pr.form('te') : (f === 'attr' || f === 'node') ? pr.plain() : f === 'tara' ? pr.form('tara') : f === 'ba' ? pr.form('ba') : pr.end({ past: false, polite: !!x.polite }));""",
    """        return s + (f === 'te' ? pr.form('te') : (f === 'attr' || f === 'node') ? (ablePast ? pr.form('past') : pr.plain()) : f === 'tara' ? pr.form('tara') : f === 'ba' ? pr.form('ba') : pr.end({ past: ablePast, polite: !!x.polite }));""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
