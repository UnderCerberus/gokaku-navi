import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Trees do much more than make streets look beautiful → 通りを美しく見せるよりはるかに多くのことをする（much / far + more than + 動詞の原形。much を「ずっとする」にしない）
rep("""    if (isW(t, 'more') && isW(T[i + 1], 'than') && i + 2 < lim && vc(T[i + 2], ['base']) &&
      (!nounC(T[i + 2]) || (i + 3 < lim && T[i + 3].k === 'w' && (PRON[T[i + 3].w] || DET[T[i + 3].w] !== undefined)))) {
      const mv = vpNonfin(i + 2, lim, 'base', {});
      if (mv) return { ja: vpJoin(mv, 'dict') + '以上のこと', end: mv.end, head: 'thing' };
      fail(m);
    }""",
    """    const kMv = /^(?:much|far)$/.test(t.w) && isW(T[i + 1], 'more') ? i + 1 : (seq(i, ['a', 'lot', 'more']) ? i + 2 : i);
    if (isW(T[kMv], 'more') && isW(T[kMv + 1], 'than') && kMv + 2 < lim && vc(T[kMv + 2], ['base']) &&
      (!nounC(T[kMv + 2]) || (kMv + 3 < lim && T[kMv + 3].k === 'w' && (PRON[T[kMv + 3].w] || DET[T[kMv + 3].w] !== undefined)))) {
      const mv = vpNonfin(kMv + 2, lim, 'base', {});
      if (mv) return { ja: vpJoin(mv, 'dict') + (kMv > i ? 'よりはるかに多くのこと' : '以上のこと'), end: mv.end, head: 'thing' };
      fail(m);
    }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
