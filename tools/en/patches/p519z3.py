import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# the people around them / the world around us → 周りの人々・周りの世界
rep("""      if (isW(t, 'abroad') && node.head && !node.pron &&""",
    """      if (isW(t, 'around') && T[j + 1] && /^(?:them|us|you|him|her|me)$/.test(T[j + 1].w || '') && node.head && !node.pron && (node.an || /^(?:world|environment|things|objects|nature|sounds|noises|people|everything)$/.test(node.head)) && (j + 2 >= lim || T[j + 2].k === 'p' || (T[j + 2].k === 'w' && (PREP[T[j + 2].w] || /^(?:and|but|or|is|was|are|were)$/.test(T[j + 2].w) || !!vc(T[j + 2], ['base', '3sg', 'past']))))) { node = Object.assign({}, node, { ja: '周りの' + node.ja, end: j + 2 }); continue; }   // the people around them → 周りの人々
      if (isW(t, 'abroad') && node.head && !node.pron &&""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
