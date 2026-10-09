import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# some jobs will disappear while new ones that we cannot yet imagine will be created → いくつかの仕事は消える一方で、…新しい仕事が生み出されるだろう
#（while 節に will があれば時の while ではなく対比。時の節は未来でも will を使わない）
rep("""        // some students learned quickly while others struggled → 何人かの学生たちは速く学んだが、ほかの学生たちは苦労した（some + 名詞 と others の対比）""",
    """        if (s2.key === 'while' && !isP(pv, ',') && T.slice(j + 1, b).some((x) => /^(?:will|won't)$/.test(x.w || '')) && T.slice(a, j).some((x) => /^(?:will|won't|would|may|might|can|could)$/.test(x.w || '')) && !(sc4.subj && sc4.subj.pron === 'others' && isW(T[a], 'some'))) {
          const nodeWf = Object.assign({}, mn4);
          const oneWf = sc4.subj && /新しいもの$/.test(sc4.subj.ja || '') && mn4.subj && !mn4.subj.pron ? mn4.subj.ja.replace(/^(?:いくつかの|一部の|何人かの|多くの|ある)/, '').replace(/たち$/, '') : '';   // new ones → 新しい仕事
          nodeWf.out = (z) => mn4.out(Object.assign({}, z || {}, { form: 'attr' })).replace(/だろう$/, '') + '一方で、' + (oneWf ? sc4.out({}).replace(/新しいもの(?=[はが])/, '新しい' + oneWf) : sc4.out({}));
          return wrap(nodeWf);
        }
        // some students learned quickly while others struggled → 何人かの学生たちは速く学んだが、ほかの学生たちは苦労した（some + 名詞 と others の対比）""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
