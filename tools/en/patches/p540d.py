import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# It seems almost too easy → ほとんど簡単すぎるように思える / The bag looks too heavy → 重すぎるように見える
# （seem / look / sound / appear / feel + (almost) too + 形容詞（to・for が続かない）は「〜すぎるように思える・見える」）
rep("""      if (L === 'grow' && !vg.passive && T[i] && T[i].k === 'w' && /^(?:fast|faster|fastest|quickly|slowly|rapidly|steadily|slower|quicker)$/.test(T[i].w)""",
    """      {
        const kTs = /^(?:almost|nearly|slightly)$/.test((T[i] || {}).w || '') && isW(T[i + 1], 'too') ? i + 1 : i;
        if (/^(?:seem|look|sound|appear|feel)$/.test(L) && !vg.passive && isW(T[kTs], 'too') && kTs + 1 < lim && adjC(T[kTs + 1]) && !isW(T[kTs + 2], 'to') && !(isW(T[kTs + 2], 'for') && T.slice(kTs + 3, lim).some((x) => isW(x, 'to'))) && !(T[kTs + 2] && T[kTs + 2].k === 'w' && !!nounC(T[kTs + 2]) && !PREP[T[kTs + 2].w] && !ADV[T[kTs + 2].w])) {
          const aTs = adjC(T[kTs + 1]);
          const fTs = aTs && aTs.e ? en.jp.adj(aTs.e.ja) : null;
          if (fTs && fTs.stem !== null && (fTs.kind === 'i' || fTs.kind === 'na')) {
            const mTs = mark();
            pick(kTs + 1, aTs.e);
            let forTs = null;
            if (isW(T[kTs + 2], 'for') && kTs + 3 < lim) forTs = np(kTs + 3, lim, { noRel: true });   // seemed too difficult for me → 私には難しすぎるように思えた
            const eTs = isW(T[kTs + 2], 'for') && !forTs ? -1 : tail(forTs ? forTs.end : kTs + 2, lim, st, o, vg);
            if (eTs === lim) {
              if (forTs) st.other.unshift(forTs.ja + 'には');
              name('too');
              const dTs = kTs > i ? ({ almost: 'ほとんど', nearly: 'ほとんど', slightly: '少し' })[T[i].w] : '';
              const tlTs = L === 'feel' ? 'と感じる' : (L === 'sound' ? 'ように聞こえる' : (L === 'seem' ? 'ように思える' : 'ように見える'));
              return done(vg, P(dTs + fTs.stem + 'すぎる' + tlTs, 'v1'), st, lim, 'SVC', o, [], { noStative: true });
            }
            fail(mTs);
          }
        }
      }
      if (L === 'grow' && !vg.passive && T[i] && T[i].k === 'w' && /^(?:fast|faster|fastest|quickly|slowly|rapidly|steadily|slower|quicker)$/.test(T[i].w)""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
