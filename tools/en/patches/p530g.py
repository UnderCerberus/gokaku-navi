import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Reviewing the material briefly and then getting a good night's sleep → 教材をざっと復習してから十分な睡眠をとること（-ing and then -ing の並列）
rep("""    if (form !== 'pp' && vp.end + 2 < lim && isW(T[vp.end], 'and') && !neg && !vp.neg && ((form === 'base' && isW(T[vp.end + 1], 'to') && vc(T[vp.end + 2], ['base'])) || (form === 'ing' && vc(T[vp.end + 1], ['ing'])))) {""",
    """    if (form === 'ing' && vp.end + 3 < lim && isW(T[vp.end], 'and') && isW(T[vp.end + 1], 'then') && !neg && !vp.neg && T[vp.end + 2].k === 'w' && !!vc(T[vp.end + 2], ['ing'])) {
      const mTh = mark();
      const vpTh = vpNonfin(vp.end + 2, lim, form, o);
      if (vpTh && !vpTh.neg && verbal(vp.pred)) { vpTh.parts = [vpJoin(vp, 'te') + 'から'].concat(vpTh.parts); return vpTh; }
      fail(mTh);
    }
    if (form !== 'pp' && vp.end + 2 < lim && isW(T[vp.end], 'and') && !neg && !vp.neg && ((form === 'base' && isW(T[vp.end + 1], 'to') && vc(T[vp.end + 2], ['base'])) || (form === 'ing' && vc(T[vp.end + 1], ['ing'])))) {""")

# Reading books and writing essays is fun → 本を読むこととエッセイを書くこと（-ing + 複数名詞 + and + -ing の複数名詞は動詞にしない。読書は予約して にしない）
rep("""      if (p === a + 1 && T[a].k === 'w' && /ing$/.test(T[a].w) && !!vc(T[a], ['ing']) && T[p].k === 'w' && !!cand(T[p], '名', ['pl']) && p + 1 < b && T[p + 1].k === 'w' && !PRON[T[p + 1].w] && (!!vc(T[p + 1], ['3sg', 'past']) || BE[T[p + 1].w] || MODAL[T[p + 1].w])) continue;""",
    """      if (p === a + 1 && T[a].k === 'w' && /ing$/.test(T[a].w) && !!vc(T[a], ['ing']) && T[p].k === 'w' && !!cand(T[p], '名', ['pl']) && T[p + 1] && T[p + 1].k === 'w' && !PRON[T[p + 1].w] && ((p + 1 < b && (!!vc(T[p + 1], ['3sg', 'past']) || BE[T[p + 1].w] || MODAL[T[p + 1].w])) || (/^(?:and|or)$/.test(T[p + 1].w) && T[p + 2] && T[p + 2].k === 'w' && !!vc(T[p + 2], ['ing'])))) continue;""")

# reviewing the material briefly → ざっと復習する（briefly + 見る・復習する・読む は ざっと）
rep("""    'well|treat|大切に',""",
    """    'well|treat|大切に',
    'briefly|review look check read glance scan go|ざっと',""")

rep("    if (isW(t, 'and') && j + 1 < lim && T[j + 1].k === 'w' && (st.manner.length || st.time.length) && !PREP[T[j + 1].w]",
    "    if (isW(t, 'and') && j + 1 < lim && T[j + 1].k === 'w' && (st.manner.length || st.time.length) && !PREP[T[j + 1].w] && !(isW(T[j + 1], 'then') && T[j + 2] && T[j + 2].k === 'w' && !!vc(T[j + 2], ['ing', 'base', 'past', '3sg']))")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
