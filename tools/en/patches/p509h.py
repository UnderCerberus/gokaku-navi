import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# p509g の受け身 see as を parseVP の先頭へ移す（熟語 see A as B の受け身の読みが先に取っていた）。「失礼であるだと」も直す
old_block_start = """    if (vg.passive && /^(?:see|regard|view|perceive|treat|describe)$/.test(vg.lemma) && isW(T[i], 'as') && i + 1 < lim) {
      const mSa = mark();"""
k0 = s.index(old_block_start)
k1 = s.index("""      fail(mSa);
    }
""", k0) + len("""      fail(mSa);
    }
""")
block = s[k0:k1]
s = s[:k0] + s[k1:]
block = block.replace("aX.adj.pred.plain().replace(/だ$/, '') ", "aX.adj.pred.plain().replace(/(?:だ|である)$/, '')")
block = block.replace("const st = ", "const st = ")
# parseVP の中では st がないので newSt(vg) を使う
block = block.replace("""      const vJa = vg.lemma === 'see' ? '見られる' : 'みなされる';""", """      const st = newSt(vg);
      const vJa = vg.lemma === 'see' ? '見られる' : 'みなされる';""")
rep("""    const kV1 = vg.neg && vg.modal && vg.idx >= 0 && vg.idx < i""", block + """    const kV1 = vg.neg && vg.modal && vg.idx >= 0 && vg.idx < i""")

# Nothing was done → 何も行われなかった（nothing は主節でも「行われる」）
rep("""      if (o.sub || o.q || vg.nonfin) return done(Object.assign({}, vg, { passive: false }), P('行われる', 'v1'), st, j, 'SV', o, [], { noStative: true });""",
    """      if (o.sub || o.q || vg.nonfin || o.subj.pron === 'nothing') return done(Object.assign({}, vg, { passive: false }), P('行われる', 'v1'), st, j, 'SV', o, [], { noStative: true });""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
