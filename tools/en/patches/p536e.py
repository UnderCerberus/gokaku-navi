import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Simply seeing, hearing, or even reading about someone else yawning → 見たり、聞いたり、あくびをしているほかの誰かについて読んだりするだけで（目的語を共有する動名詞の列挙: 前の動名詞は語だけ）
rep("""    // simply warning them（副詞 + 動名詞）→ 単に彼らに警告すること""",
    """    {
      let kL = a, simL = '';
      if (T[kL] && T[kL].k === 'w' && /^(?:simply|just|merely|only)$/.test(T[kL].w)) { simL = 'だけ'; kL++; }
      const bare = [];
      while (kL + 1 < s && T[kL].k === 'w' && !!vc(T[kL], ['ing']) && isP(T[kL + 1], ',')) { bare.push(kL); kL += 2; }
      if (bare.length >= 1 && T[kL] && /^(?:or|and)$/.test(T[kL].w || '') && kL + 1 < s) {
        let kZ = kL + 1, advZ = '';
        if (T[kZ] && T[kZ].k === 'w' && /^(?:even|also|just|simply)$/.test(T[kZ].w)) { advZ = T[kZ].w === 'even' ? 'さらには' : ''; kZ++; }
        if (ingVerb(kZ, s) || (T[kZ] && T[kZ].k === 'w' && !!vc(T[kZ], ['ing']))) {
          const mL = mark();
          const gZ = vpNonfin(kZ, s, 'ing', {});
          if (gZ && gZ.end === s) {
            const parts = bare.map((x) => { const cx = vc(T[x], ['ing']); pick(x, cx.e); return P(verbSense(cx.e, true).core).form('past') + 'り'; });
            name('gerund');
            return { ja: parts.join('、') + '、' + advZ + vpJoin(gZ, 'past') + 'りする' + (simL ? 'だけのこと' : 'こと'), end: s, gerund: true };
          }
          fail(mL);
        }
      }
    }
    // simply warning them（副詞 + 動名詞）→ 単に彼らに警告すること""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
