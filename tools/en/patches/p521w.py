import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# …were originally borrowed from other languages, often with their meanings slightly changed → もともと他の言語から借りられて、多くの場合、意味が少し変わった
#（頻度の副詞 + 文末の with 句は with 句にかかる。主節の動詞に「よく」をつけない）
rep("""    // …, making it impossible to cross / …, causing many deaths（結果の分詞構文 → そして〜）
""",
    """    for (let x = a + 3; x + 4 < b; x++) {
      if (!(isP(T[x], ',') && T[x + 1].k === 'w' && /^(?:often|usually|sometimes|frequently|occasionally|always|generally|typically)$/.test(T[x + 1].w) && isW(T[x + 2], 'with'))) continue;
      const mFw = mark();
      const lfFw = sentence(a, x, o);
      const ocFw = lfFw ? withOC(x + 2, b) : null;
      if (lfFw && ocFw && ocFw.end === b && /[てで]$/.test(ocFw.ja)) {
        name('with-oc');
        const ADVF = { often: '多くの場合', usually: 'たいてい', sometimes: '時には', frequently: 'しばしば', occasionally: '時々', always: 'いつも', generally: '一般に', typically: '一般に' }[T[x + 1].w];
        const tlFw = lfFw.past ? ocFw.ja.replace(/って$/, 'った').replace(/いて$/, 'いた').replace(/いで$/, 'いだ').replace(/んで$/, 'んだ').replace(/て$/, 'た').replace(/で$/, 'だ') : ocFw.ja.replace(/て$/, 'ている').replace(/で$/, 'でいる');
        return wrap({ out: (y) => lfFw.out(Object.assign({}, y || {}, { form: 'te' })) + '、' + ADVF + '、' + tlFw, sp: lfFw.sp, subj: lfFw.subj, past: lfFw.past });
      }
      fail(mFw);
      break;
    }
    // …, making it impossible to cross / …, causing many deaths（結果の分詞構文 → そして〜）
""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
