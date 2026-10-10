import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# absorb carbon dioxide and release oxygen, which helps improve air quality（主語の中の「, which / , who」の非制限節は、動詞の前のコンマで閉じる。閉じていない区切りは主語にしない）
rep("""      if (s - 2 > a && T[s - 1].k === 'w' && (HAVE[T[s - 1].w] || MODAL[T[s - 1].w] || DO[T[s - 1].w] || BE[T[s - 1].w]) && T[s - 2].k === 'w' && /^(?:who|that|which)$/.test(T[s - 2].w)) continue;""",
    """      if (s - 2 > a && T[s - 1].k === 'w' && (HAVE[T[s - 1].w] || MODAL[T[s - 1].w] || DO[T[s - 1].w] || BE[T[s - 1].w]) && T[s - 2].k === 'w' && /^(?:who|that|which)$/.test(T[s - 2].w)) continue;
      if (s - 1 > a && !isP(T[s - 1], ',') && T.slice(a, s - 1).some((x, q) => isP(x, ',') && T[a + q + 1] && /^(?:which|who)$/.test(T[a + q + 1].w || ''))) continue;""")

# they provide shade and help keep the air cooler → 日陰を作り、空気を涼しく保つのに役立つ（and の直後の help などの原形 + 原形の動詞は、主語を共有する述語。help を単数名詞の主語にしない）
rep("""        if (isCC && /^(?:so|and|but)$/.test(w) && isW(T[rs], 'let') && rs + 2 < b && !o.sub) {""",
    """        if (isCC && w === 'and' && je === j && rs === j + 1 && left.subj && !left.past && !left.passive && T[rs] && T[rs].k === 'w' && !!vc(T[rs], ['base']) && !vc(T[rs], ['3sg', 'past']) && !!nounC(T[rs]) && !cand(T[rs], '名', ['pl']) &&
          (left.modal || !!left.subj.pl || (left.subj.pron && /^(?:i|you|we|they)$/.test(left.subj.pron))) && T[rs + 1] && T[rs + 1].k === 'w' && !!vc(T[rs + 1], ['base']) && !vc(T[rs + 1], ['3sg', 'past']) && !MODAL[T[rs + 1].w] && !BE[T[rs + 1].w]) {
          const mHk = mark();
          const rvHk = predOnly(rs, b, Object.assign({}, o, { subj: left.subj, pastHint: false }));
          if (rvHk) return wrap(joinCoord(w, left, rvHk));
          fail(mHk);
        }
        if (isCC && /^(?:so|and|but)$/.test(w) && isW(T[rs], 'let') && rs + 2 < b && !o.sub) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
