import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# imagine situations (that) they have never experienced → 彼らが（関係詞節の先行詞は節の主語の they の先行詞にならない）
rep("""      if (/^(?:we|us|our|you|your|people|everyone|everybody|someone|somebody)$/.test(t.w)) return 'an';
      if (/^(?:they|them|their)$/.test(t.w)) continue;""",
    """      if (/^(?:we|us|our|you|your|people|everyone|everybody|someone|somebody)$/.test(t.w)) return 'an';
      if (/^(?:they|them|their)$/.test(t.w)) continue;
      if (T[i].w === 'they' && (x === i - 1 || (x === i - 2 && /^(?:that|which|whom)$/.test(T[i - 1].w || ''))) && !PRON[t.w] && !!nounC(t) && T[i + 1] && T[i + 1].k === 'w' && (HAVE[T[i + 1].w] || MODAL[T[i + 1].w] || DO[T[i + 1].w] || !!vc(T[i + 1], ['base', 'past']))) continue;   // situations they have never experienced""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
