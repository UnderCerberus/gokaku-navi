import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# She speaks as if she had lived in Paris all her life, although she has never been abroad
# → 一度も海外に行ったことがないけれども、彼女はまるで…かのように話す（コンマのあとの although は主節にかける。as if 節の中に入れない）
rep("""      if (/^(?:because|why|how)$/.test(T[j].w) && T[j - 1].k === 'w' && BE[T[j - 1].w]) continue;      // This may be because … は be の補語（parseBe で読む）
""",
    """      if (/^(?:because|why|how)$/.test(T[j].w) && T[j - 1].k === 'w' && BE[T[j - 1].w]) continue;      // This may be because … は be の補語（parseBe で読む）
      if (!isP(T[j - 1], ',') && !/^(?:although|though|even though)$/.test(s2.key) && T.slice(j + 1, b - 1).some((x, q) => /^(?:although|though)$/.test(x.w || '') && isP(T[j + q], ','))) continue;   // as if …, although … の although は主節の従属節
""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
