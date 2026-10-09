import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# 移動の動詞のあとの方角の語（限定詞なし）は目的語にしない → tail で「南へ」
rep("""      if (advOnly) { k = modOther(j0, lim, st, o, vg); if (k > 0) { j = k; continue; } }""",
    """      if (advOnly) { k = modOther(j0, lim, st, o, vg); if (k > 0) { j = k; continue; } }
      if (t.k === 'w' && DIRW[t.w] && MOVEV.test(vg.lemma) && !vg.passive && (j0 + 1 >= lim || T[j0 + 1].k === 'p' || PREP[(T[j0 + 1] || {}).w] || /^(?:to|and|every)$/.test((T[j0 + 1] || {}).w || ''))) { st.other.unshift(DIRW[t.w] + 'へ'); j = j0 + 1; continue; }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
