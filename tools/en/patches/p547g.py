import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# students who sleep … find it harder to remember what they have learned → 彼らが何を学んだか（what / whatever のあとの they は、前にある人の複数名詞を後ろから探して先に受ける。文頭の Studies を受けない）
rep("""    if (T[i].w === 'they' && i > 1 && T[i - 1].k === 'w' && (/^(?:and|but|so|because|when|if|although|though|while|since|as|until|after|before)$/.test(T[i - 1].w)""",
    """    if (T[i].w === 'they' && i > 1 && isW(T[i - 1], 'what')) {
      for (let x = i - 2; x >= 0; x--) {
        const t0 = T[x];
        if (t0.k !== 'w' || PRON[t0.w] || DET[t0.w] !== undefined || !/s$/.test(t0.w)) continue;
        const cW = cand(t0, '名', ['pl']);
        if (cW && cW.e && (isPerson(cW) || PERSONS[cW.lemma])) return 'an';
      }
    }
    if (T[i].w === 'they' && i > 1 && T[i - 1].k === 'w' && (/^(?:and|but|so|because|when|if|although|though|while|since|as|until|after|before)$/.test(T[i - 1].w)""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
