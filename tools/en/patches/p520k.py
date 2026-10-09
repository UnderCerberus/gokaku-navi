import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# why some animals can survive for months while others die within a few days → なぜ何か月も生き残れる動物もいれば、数日以内に死ぬ動物もいるのか
rep("""    // what we notice and remember / how it is made and used（疑問詞節の中の述語の並列 → 何に気づき覚えているか）
""",
    """    if ((!cl2 || !gap.used) && wh.type !== 'np' && isW(T[wh.end], 'some') && T[wh.end + 1] && T[wh.end + 1].k === 'w' && !!nounC(T[wh.end + 1])) {
      const kWo = T.findIndex((x, q) => q > wh.end + 2 && q < lim - 2 && /^(?:while|whereas)$/.test(x.w || '') && isW(T[q + 1], 'others'));
      if (kWo > 0) {
        fail(m);
        gap.used = false;
        const cA = clause(wh.end, isP(T[kWo - 1], ',') ? kWo - 1 : kWo, { gap: gap, sub: true });
        const cB = cA && gap.used ? clause(kWo + 1, lim, { sub: true }) : null;
        if (cA && cB && cA.subj && cB.subj && cB.subj.pron === 'others') {
          const hdS = (cA.subj.ja || '').replace(/^(?:いくつかの|何人かの|一部の)/, '').replace(/たち$/, '').replace(/^人々$/, '人');
          name('indirect-q'); name('correlative');
          return { str: cA.out({ omit: '\\u0001', form: 'attr' }).replace(new RegExp('^(.*?)' + cA.subj.ja + '(?:が|は)'), '$1') + hdS + 'もいれば、' + cB.out({ omit: 'others', form: 'attr' }) + hdS + 'もいるのか', end: lim };
        }
        fail(m);
        gap.used = false;
      }
    }
    // what we notice and remember / how it is made and used（疑問詞節の中の述語の並列 → 何に気づき覚えているか）
""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
