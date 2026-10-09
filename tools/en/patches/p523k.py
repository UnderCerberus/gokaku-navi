import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# He gave what little money he had to the poor family → 自分が持っていたわずかなお金すべてを貧しい家族に与えた
#（動詞の目的語の what (little / few) + 名詞 + 節 は「〜する…すべて」。どんな小さいお金 にしない。give 型の動詞なら to 句の手前で節を閉じる）
rep("""    // the first few months → 最初の数か月（the first few + 期間の名詞）""",
    """    if (isW(t, 'what') && Q_DEPTH === 0 && i > 0 && T[i - 1].k === 'w' && !!vc(T[i - 1], ['base', '3sg', 'past']) && i + 3 < lim && T[i + 1].k === 'w') {
      const kWl = /^(?:little|few)$/.test(T[i + 1].w) ? i + 2 : i + 1;
      const mWl = mark();
      const nWl = T[kWl] && T[kWl].k === 'w' && !!nounC(T[kWl]) && !PRON[T[kWl].w] ? np1(kWl, lim, { noRel: true, noPost: true, noCoord: true }) : null;
      if (nWl && nWl.end + 1 < lim && T[nWl.end].k === 'w' && PRON[T[nWl.end].w] && PRON[T[nWl.end].w].sub) {
        const giveWl = /^(?:give|gives|gave|given|send|sends|sent|lend|lent|offer|offered|donate|donated|pay|paid|hand|handed|show|showed|leave|left|spend|spent|share|shared)$/.test(T[i - 1].w);
        const endsWl = [];
        if (giveWl) for (let x = nWl.end + 2; x < lim; x++) if (/^(?:to|with|on|for)$/.test(T[x].w || '')) { endsWl.push(x); break; }
        endsWl.push(lim);
        for (const eW of endsWl) {
          const mE = mark();
          const gapWl = { type: 'np', rel: true, used: false };
          const clWl = clause(nWl.end, eW, { gap: gapWl, sub: true });
          if (clWl && gapWl.used) { name('relative-what'); return { ja: clWl.out({ part: 'が', form: 'attr' }) + (kWl > i + 1 ? 'わずかな' : '') + nWl.ja + 'すべて', end: eW, head: nWl.head }; }   // what little money he had → 持っていたわずかなお金すべて
          fail(mE);
        }
      }
      fail(mWl);
    }
    // the first few months → 最初の数か月（the first few + 期間の名詞）""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
