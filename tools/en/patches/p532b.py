import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# I have been there once / many times / at least once → 一度そこに行ったことがある（there / here + 回数は経験。for / since の継続は除く）
rep("""    // have been to ~（〜に行ったことがある）
    if (vg.perfect && isW(t, 'to') && j + 1 < lim) {""",
    """    if (vg.perfect && !vg.prog && t && /^(?:there|here)$/.test(t.w || '') && !T.slice(j + 1, lim).some((x) => /^(?:for|since|all|until|till)$/.test(x.w || '')) && (T.slice(j + 1, lim).some((x) => /^(?:once|twice|times|before)$/.test(x.w || '')) || T.slice(0, j).some((x) => /^(?:ever|never)$/.test(x.w || '')))) {
      const mTh = mark();
      const nM0 = st.manner.length, nO0 = st.other.length, nT0 = st.time.length;
      const eTh = tail(j + 1, lim, st, o, vg);
      if (eTh === lim) { vg.lemma = 'go'; st.exp = true; return fin(t.w === 'there' ? P('行く', 'v5') : P('来る', 'kuru'), lim, 'SV', [t.w === 'there' ? 'そこに' : 'ここに']); }
      st.manner.length = nM0; st.other.length = nO0; st.time.length = nT0;
      fail(mTh);
    }
    // have been to ~（〜に行ったことがある）
    if (vg.perfect && isW(t, 'to') && j + 1 < lim) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
