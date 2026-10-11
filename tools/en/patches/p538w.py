import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# One reason is that noise triggers the body's stress response, even when we are asleep → 1つの理由は、私たちが眠っているときでさえ騒音が…ということだ
# （名詞 + be + that 節のあとの when / if などの従属節は that 節の中で読む。主節の「1つの理由は」にかけない）
rep("""      // Many students say that they feel nervous when they speak …（言う・思う + that 節の中の when は that 節の中で読む）""",
    """      if (/^(?:when|even when|if|even if|whenever|unless|while|once|before|after|until|as soon as)$/.test(s2.key) && T.slice(a, j).some((x, q) => isW(x, 'that') && q > 1 && T[a + q - 1].k === 'w' && /^(?:is|was|are|were)$/.test(T[a + q - 1].w) && T[a + q - 2].k === 'w' && !!nounC(T[a + q - 2]) && !PRON[T[a + q - 2].w])) continue;
      // Many students say that they feel nervous when they speak …（言う・思う + that 節の中の when は that 節の中で読む）""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
