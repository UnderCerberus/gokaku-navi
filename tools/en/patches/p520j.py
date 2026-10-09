import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Some animals can survive for months while others die … → 何か月も生き残れる動物もいれば、…死ぬ動物もいる（コンマなしの while others も）
rep("""      const kOw = T.findIndex((x, q) => q > 3 + sW0 && isW(x, 'others') && (isP(T[q - 1], ',') || (!sW0 && T[q - 1] && /^(?:while|whereas|but|and)$/.test(T[q - 1].w || '') && isP(T[q - 2], ','))));
      if (kOw > 0 && kOw + 1 < b) {
        const kEw = isP(T[kOw - 1], ',') ? kOw - 1 : kOw - 2;""",
    """      const kOw = T.findIndex((x, q) => q > 3 + sW0 && isW(x, 'others') && (isP(T[q - 1], ',') || (!sW0 && T[q - 1] && /^(?:while|whereas|but|and)$/.test(T[q - 1].w || '') && isP(T[q - 2], ',')) || (!sW0 && T[q - 1] && /^(?:while|whereas)$/.test(T[q - 1].w || ''))));
      if (kOw > 0 && kOw + 1 < b) {
        const kEw = isP(T[kOw - 1], ',') ? kOw - 1 : (isP(T[kOw - 2], ',') ? kOw - 2 : kOw - 1);""")
# Researchers found that some students learned quickly while others struggled（that 節・疑問詞節の中の some + 名詞 … while others は節の中で対比）
rep("""      if (/^(?:because|why|how)$/.test(T[j].w) && T[j - 1].k === 'w' && BE[T[j - 1].w]) continue;      // This may be because … は be の補語（parseBe で読む）""",
    """      if (/^(?:because|why|how)$/.test(T[j].w) && T[j - 1].k === 'w' && BE[T[j - 1].w]) continue;      // This may be because … は be の補語（parseBe で読む）
      if (!o.sub && /^(?:while|whereas)$/.test(s2.key) && isW(T[j + 1], 'others') && T.slice(a, j).some((x, q) => isW(x, 'some') && T[a + q + 1] && T[a + q + 1].k === 'w' && !!nounC(T[a + q + 1]) && T.slice(a, a + q).some((y) => y.k === 'w' && (y.w === 'that' || !!WH[y.w])))) continue;   // found that some students … while others … → that 節の中で対比""")
rep("""        if (mn4.oto && mn4.oto.s && !isP(pv, ',') && !o.sub &&""",
    """        // some students learned quickly while others struggled → 何人かの学生たちは速く学んだが、ほかの学生たちは苦労した（some + 名詞 と others の対比）
        if (/^(?:while|whereas)$/.test(s2.key) && sc4.subj && sc4.subj.pron === 'others' && mn4.subj && !mn4.subj.pron && /^(?:何人かの|一部の|いくつかの)/.test(mn4.subj.ja || '') && isW(T[a], 'some')) {
          const hdO = mn4.subj.ja.replace(/^(?:何人かの|一部の|いくつかの)/, '');
          const nodeSo = Object.assign({}, sc4, { end: b });
          nodeSo.out = (z) => {
            const l0 = mn4.out({});
            if (/もい(?:る|た)$/.test(l0)) {   // 速く学んだ学生もいれば、苦労した学生もいた
              const r0 = l0.replace(/もい(?:る|た)$/, 'もいれば、') + sc4.out({ omit: 'others', form: 'attr' }) + hdO.replace(/たち$/, '').replace(/^人々$/, '人') + 'もい' + (/もいた$/.test(l0) ? 'た' : 'る');
              return z && z.form === 'te' ? r0.replace(/[たる]$/, 'て') : r0;
            }
            return mn4.out({ contrast: true }) + 'が、' + sc4.out(Object.assign({}, z || {}, { contrast: true })).replace(/^他の人たち/, 'ほかの' + hdO);
          };
          return wrap(nodeSo);
        }
        if (mn4.oto && mn4.oto.s && !isP(pv, ',') && !o.sub &&""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
