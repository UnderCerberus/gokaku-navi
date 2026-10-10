import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# everyone makes mistakes when they are new → 彼ら（従属接続詞のあとの主語の they は、直前の節の主語を受ける: everyone / people / 複数名詞）
rep("""    const needAn = isW(T[i], 'their') && !!T[i + 1] && PERSON_POSS.test(T[i + 1].w || '');   // far from their families → 人の名詞を探す""",
    """    if (T[i].w === 'they' && i > 1 && T[i - 1].k === 'w' && /^(?:when|if|because|although|though|while|since|as|until|after|before|once|unless)$/.test(T[i - 1].w)) {
      for (let x = i - 2; x >= 0; x--) {
        const t0 = T[x];
        if (isP(t0, ',') || isP(t0, ';')) break;
        if (t0.k !== 'w') continue;
        const nx = T[x + 1];
        const subjX = !!nx && nx.k === 'w' && (!!BE[nx.w] || !!MODAL[nx.w] || !!HAVE[nx.w] || !!DO[nx.w] || !!vc(nx, ['3sg', 'past', 'base']));
        if (!subjX) continue;
        if (/^(?:everyone|everybody|someone|somebody|people|nobody|anyone|anybody)$/.test(t0.w)) return 'an';
        const cS = !PRON[t0.w] && DET[t0.w] === undefined ? cand(t0, '名', ['pl']) : null;
        if (cS && cS.e && !vc(t0, ['3sg'])) return isPerson(cS) || PERSONS[cS.lemma] || ORG[cS.lemma] || ANIMAL_N.test(t0.w) ? 'an' : 'inan';
      }
    }
    const needAn = isW(T[i], 'their') && !!T[i + 1] && PERSON_POSS.test(T[i + 1].w || '');   // far from their families → 人の名詞を探す""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
