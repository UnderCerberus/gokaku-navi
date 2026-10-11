import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# I felt a little sad that I would not be able to see him again → 二度と彼に会えないことが少し悲しかった
# （feel + 感情の形容詞 + that 節は be + 形容詞 + that 節と同じに読む）
rep("""    if (COPV[L] && !(L === 'prove' && !adjC(T[i]) && !isW(T[i], 'to'))) {   // prove は形容詞・to be が続くときだけ「〜と分かる」（Prove that … / Prove it は 証明する）""",
    """    if (L === 'feel' && !vg.passive && i + 2 < lim) {
      let kFt = i;
      if (seq(kFt, ['a', 'little']) || seq(kFt, ['a', 'bit'])) kFt += 2;
      while (kFt < lim && T[kFt].k === 'w' && /^(?:very|so|really|quite|rather|extremely|truly|deeply|terribly|slightly|somewhat)$/.test(T[kFt].w)) kFt++;
      const aFt = kFt < lim ? adjC(T[kFt]) : null;
      if (aFt && isW(T[kFt + 1], 'that') && kFt + 2 < lim && (EMO[aFt.lemma] || /^(?:sad|glad|happy|sorry|lucky|proud|grateful|thankful|relieved|guilty|bad|ashamed|embarrassed|disappointed|surprised|afraid|sure|confident|certain)$/.test(aFt.lemma))) {
        const mFt = mark();
        const rFt = parseBe(Object.assign({}, vg, { lemma: 'be' }), i, lim, o);
        if (rFt && rFt.end === lim) return rFt;
        fail(mFt);
      }
    }
    if (COPV[L] && !(L === 'prove' && !adjC(T[i]) && !isW(T[i], 'to'))) {   // prove は形容詞・to be が続くときだけ「〜と分かる」（Prove that … / Prove it は 証明する）""")

# I was sad that I would not be able to see him again → 二度と彼に会えないことが悲しかった（that 節が だろう で終わるときは「〜だろう悲しかった」にしない）
rep("""              return fin(pE4, lim, 'SVC', [cl3.out({ part: 'が', form: 'te', omit: omS })]);""",
    """              const teE3 = cl3.out({ part: 'が', form: 'te', omit: omS });
              return fin(pE4, lim, 'SVC', [/だろう$/.test(teE3) ? cl3.out({ part: 'が', form: 'attr', omit: omS }).replace(/だろう$/, '') + 'ことが' : teE3]);""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
