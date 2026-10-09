import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# 前置詞が後ろに残る不定詞の誤用: plans to reduce … in | order to …（in order to）/ students to take part in | volunteer activities
# 呼び出し側が名詞句の範囲を前置詞の直後で切ったとき、次の語が述語になれない（名詞・限定詞）なら、前置詞は後ろの名詞をとる
rep("""        if (T[x].k === 'w' && /^(?:with|in|on|to|about|for|at|from|into|under)$/.test(T[x].w) && (x + 1 >= e || T[x + 1].k === 'p' || /^(?:and|but|or|because|when|if|so|than)$/.test(T[x + 1].w || ''))) { pS = x; break; }""",
    """        if (T[x].k === 'w' && /^(?:with|in|on|to|about|for|at|from|into|under)$/.test(T[x].w) && (x + 1 >= e || T[x + 1].k === 'p' || /^(?:and|but|or|because|when|if|so|than)$/.test(T[x + 1].w || ''))) {
          const nx = T[x + 1];
          if (x + 1 === e && nx && nx.k === 'w' && !BE[nx.w] && !MODAL[nx.w] && !/^(?:has|have|had|do|does|did)$/.test(nx.w) && !vc(nx, ['3sg', 'past']) && (DET[nx.w] !== undefined || !!nounC(nx) || !!adjC(nx))) break;   // in order to / in volunteer activities
          pS = x; break;
        }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
