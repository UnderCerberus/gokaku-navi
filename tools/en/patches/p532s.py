import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# My first few attempts looked so strange that we both started laughing → とても奇妙に見えたので、私たちは2人とも笑い始めた（連結動詞 + so + 形容詞 + that 節）
rep("""    if (COPV[L] && !(L === 'prove' && !adjC(T[i]) && !isW(T[i], 'to'))) {   // prove は形容詞・to be が続くときだけ「〜と分かる」（Prove that … / Prove it は 証明する）""",
    """    if (COPV[L] && !(L === 'prove' && !adjC(T[i]) && !isW(T[i], 'to'))) {   // prove は形容詞・to be が続くときだけ「〜と分かる」（Prove that … / Prove it は 証明する）
      if (isW(T[i], 'so') && i + 3 < lim && !!adjC(T[i + 1]) && isW(T[i + 2], 'that') && !st.soThat && !o.soCop && /^(?:look|seem|appear|sound|feel|become|get|grow|taste|smell)$/.test(L)) {
        const mSo = mark();
        const csSo = sentence(i + 3, lim, { sub: true });
        if (csSo) {
          const omSo = o.subj && o.subj.pron && csSo.subj && csSo.subj.pron === o.subj.pron ? o.subj.pron : null;
          st.soThat = (x) => (x && x.form === 'attr' ? 'ため' + csSo.out({ omit: omSo, part: 'が', form: 'attr' }) : 'ので、' + csSo.out({ omit: omSo, polite: !!(x && x.polite) }));
          const rSo = vpFrame(vg, i, i + 2, st, Object.assign({}, o, { soCop: true }));
          if (rSo) { name('so-that'); return Object.assign({}, rSo, { end: lim }); }
          st.soThat = null;
        }
        fail(mSo);
      }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
