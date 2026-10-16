import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# If birds arrive too late, the insects they depend on … → それらが頼る昆虫（p544n の接触節の they は、前に動物の複数名詞があれば動物を受ける）
rep("""      T[i + 1] && T[i + 1].k === 'w' && (!!BE[T[i + 1].w] || !!MODAL[T[i + 1].w] || !!HAVE[T[i + 1].w] || !!DO[T[i + 1].w] || !!vc(T[i + 1], ['past', 'base']))) return 'an';""",
    """      T[i + 1] && T[i + 1].k === 'w' && (!!BE[T[i + 1].w] || !!MODAL[T[i + 1].w] || !!HAVE[T[i + 1].w] || !!DO[T[i + 1].w] || !!vc(T[i + 1], ['past', 'base']))) {
      for (let x = i - 2; x >= 0; x--) {
        const t0 = T[x];
        if (t0.k !== 'w' || PRON[t0.w] || DET[t0.w] !== undefined) continue;
        const cS = cand(t0, '名', ['pl']);
        if (!cS || !cS.e || !/s$/.test(t0.w)) continue;
        if (isPerson(cS) || PERSONS[cS.lemma] || ORG[cS.lemma]) return 'an';
        if (ANIMAL_N.test(t0.w)) return 'inan';
      }
      return 'an';
    }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
