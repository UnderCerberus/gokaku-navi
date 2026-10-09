import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# 範囲の外の次の語が名詞句の始まり（述語になれない）か: 前置詞は後ろの名詞をとる（in | order to / in | volunteer activities）
rep("""  const PART = dic({ up: '', down: '', out: '外に', off: '', on: '', in: '中に', over: '', around: 'あちこち', along: '', through: '', by: '',""",
    """  function npNext(x) {
    const nx = T[x];
    return !!nx && nx.k === 'w' && !BE[nx.w] && !MODAL[nx.w] && !/^(?:has|have|had|do|does|did)$/.test(nx.w) && !vc(nx, ['3sg', 'past']) && (DET[nx.w] !== undefined || !!nounC(nx) || !!adjC(nx));
  }
  const PART = dic({ up: '', down: '', out: '外に', off: '', on: '', in: '中に', over: '', around: 'あちこち', along: '', through: '', by: '',""")
rep("""          const nx = T[x + 1];
          if (x + 1 === e && nx && nx.k === 'w' && !BE[nx.w] && !MODAL[nx.w] && !/^(?:has|have|had|do|does|did)$/.test(nx.w) && !vc(nx, ['3sg', 'past']) && (DET[nx.w] !== undefined || !!nounC(nx) || !!adjC(nx))) break;   // in order to / in volunteer activities""",
    """          if (x + 1 === e && npNext(x + 1)) break;   // in order to / in volunteer activities""")
rep("""      if (PART[t.w] !== undefined && !ADV[t.w]) {""",
    """      if (PART[t.w] !== undefined && !ADV[t.w] && !(j + 1 === lim && PREP[t.w] && npNext(j + 1))) {   // entering the city center in | order to …（範囲で切られた前置詞を副詞にしない）""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
