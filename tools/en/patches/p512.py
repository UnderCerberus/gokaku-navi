import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# fewer and fewer people wear watches → 腕時計をする人がますます減っている（more and more の対）
rep("""    if (seq(i, ['more', 'and', 'more']) && i + 3 < lim) {
      const mm = np1(i + 3, lim, o);
      if (mm) return Object.assign({}, mm, { ja: 'ますます多くの' + mm.ja });
      fail(m);
    }""",
    """    if (seq(i, ['more', 'and', 'more']) && i + 3 < lim) {
      const mm = np1(i + 3, lim, o);
      if (mm) return Object.assign({}, mm, { ja: 'ますます多くの' + mm.ja });
      fail(m);
    }
    if ((seq(i, ['fewer', 'and', 'fewer']) || seq(i, ['less', 'and', 'less'])) && i + 3 < lim) {
      const mf = np1(i + 3, lim, o);
      if (mf) return Object.assign({}, mf, { ja: 'ますます少ない' + mf.ja });
      fail(m);
    }""")
rep("""      const restF = sj.ja.replace(/^(?:より(?:少ない|多くの)|ますます(?:多くの)?)/, '');""",
    """      const restF = sj.ja.replace(/^(?:より(?:少ない|多くの)|ますます(?:多くの|少ない)?)/, '');""")
rep("""(/^より少ない/.test(sj.ja) ? 'が減って' : (/^ますます/.test(sj.ja) ? 'がますます増えて' : 'が増えて'))""",
    """(/^より少ない/.test(sj.ja) ? 'が減って' : (/^ますます少ない/.test(sj.ja) ? 'がますます減って' : (/^ますます/.test(sj.ja) ? 'がますます増えて' : 'が増えて')))""")

# What if machines become smarter than the humans who created them? → 機械が…より賢くなったらどうなるだろうか
rep("""    // Recycling not only reduces waste but also saves energy → リサイクルはごみを減らすだけでなく、エネルギーも節約する""",
    """    if (seq(0, ['what', 'if']) && b > 3) {
      const mWi = mark();
      const cWi = sentence(2, b, { sub: true });
      if (cWi) { name('idiom'); return { ok: true, ja: 'もし' + cWi.out({ part: 'が', form: 'tara' }) + 'どうなるだろうか。', sp: '', names: NAMES.slice(), sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() }; }
      fail(mWi);
      reset(tokens);
    }
    // Recycling not only reduces waste but also saves energy → リサイクルはごみを減らすだけでなく、エネルギーも節約する""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
