import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# This is not simply because they stay up playing games → これは単に彼らがゲームをして夜更かしするからではない
# （be + not (simply / just / only) because は be の補語。文を分ける従属節にせず、否定の「〜からではない」）
rep("""      if (/^(?:because|why|how)$/.test(T[j].w) && T[j - 1].k === 'w' && BE[T[j - 1].w]) continue;      // This may be because … は be の補語（parseBe で読む）""",
    """      if (/^(?:because|why|how)$/.test(T[j].w) && T[j - 1].k === 'w' && BE[T[j - 1].w]) continue;      // This may be because … は be の補語（parseBe で読む）
      if (/^(?:because|not because|simply because|just because|only because|mainly because|partly because)$/.test(s2.key) && j > a + 1 && ((T[j - 1].k === 'w' && BE[T[j - 1].w] && s2.key === 'not because') || (isW(T[j - 1], 'not') && T[j - 2] && T[j - 2].k === 'w' && BE[T[j - 2].w]))) continue;""")
rep("""    if (vg.lemma === 'be' && !vg.passive && !vg.neg && i + 2 < lim && (isW(T[i], 'because') || (T[i].k === 'w' && /^(?:mainly|partly|largely|simply|probably|just|only)$/.test(T[i].w) && isW(T[i + 1], 'because')))) {""",
    """    if (vg.lemma === 'be' && !vg.passive && i + 2 < lim && (isW(T[i], 'because') || (T[i].k === 'w' && /^(?:mainly|partly|largely|simply|probably|just|only)$/.test(T[i].w) && isW(T[i + 1], 'because')))) {
      if (vg.neg && T[i].k === 'w' && /^(?:simply|just|only|merely)$/.test(T[i].w)) st.manner.push('単に');""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
